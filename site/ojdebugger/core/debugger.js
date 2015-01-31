/**
 * gdb封装模块
 */
var path = require('path');
var cp = require('child_process');
var parser = require('./parser');
var util = require('../util/util');
var methods = require('../config/config').methods;

//debugger对象
var dbr = {};
module.exports = dbr;

//存放所有gdb进程的map对象
var gdbMap = {};

//使用配置对象自动构建常规的debugger方法
for(var methodName in methods){
    if(!methods.hasOwnProperty(methodName)) continue;

    var methodConfig = methods[methodName];
    //如果配置了command属性表示需要自动生成则继续
    if(!methodConfig.command) continue;

    (function(methodName,methodConfig){
        dbr[methodName] = function(debugId,callback){
            //取出gdb实例
            var gdb = gdbMap[debugId];
            if(!gdb)
                return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

            //截获batch事件及其带来的数据
            gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
                console.log(debugId+' '+methodName+' resolve');
                //console.log('read complete-----------------\n'+batch);
                //console.log('-------------------------------\n');

                //配置好的parse函数的名称
                var parseNames = methodConfig.parseNames;
                doParses(batch,parseNames,function(err,result){
                    if(err) callback(err);
                    if(result) callback(null,result);
                });
            });

            //向gdb进程传入指令
            gdb.stdin.write(methodConfig.command+' \n');
        };
    })(methodName,methodConfig);
}

//以下的均为非常规的debugger方法，即配置时未指定command属性，实现需要自行定义
/**
 * 开启debug
 * @param programName
 * @param callback
 */
dbr.debug = function(programName,callback){
    var programPath = path.join(__dirname,'../program',programName);

    var gdb = cp.spawn('gdb',['--interpreter=mi',programPath]);
    var data = '';

    gdb.stdout.on('data',function(chunk){
        data += chunk;

        //在读到的gdb输出中检索(gdb)分隔标记，每个标记前面的数据都是一个batch
        var batchData = data.match(/([\s\S]*?)\(gdb\)\s*/);
        while(batchData){
            //发送batch事件与数据
            gdb.stdout.emit('batch',batchData[0]);

            //把发出去的数据去除，再检索还有没有batch
            data = data.replace(/[\s\S]*?\(gdb\)\s*/,'');
            batchData = data.match(/([\s\S]*?)\(gdb\)/);
        }
    });

    //读完一批数据出发batch事件，进行输出的处理操作
    gdb.stdout.on('batch',function(){
        console.log(" DEBUG resolve");

        var debugId = 'debug-'+util.genDebugId();
        gdbMap[debugId] = gdb;

        var result = methods['debug'].result||{};
        result.debugId = debugId;
        callback(null, result);
    });
};

/**
 * 添加断点操作
 * @param debugId
 * @param breakLines
 * @param callback
 */
dbr.breakPoint = function(debugId,breakLines,callback){
    var gdb = gdbMap[debugId];
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    var received = 0;
    var result = methods['breakPoint'].result||{};

    gdb.stdout.removeAllListeners('batch').on('batch',function(){
        console.log(debugId+" BP resolve");

        received++;
        if(received === breakLines.length){
            result.breakPointNum = breakLines.length;
            callback(null,result);
        }
    });

    //加入断点
    if(!breakLines || breakLines.length==0) {
        result.breakPointNum = 0;
        callback(null, result);
    }else{
        breakLines.forEach(function(lineNum){
            gdb.stdin.write('break '+lineNum+'\n');
        });
    }
};

/**
 * 查值操作
 * @param debugId
 * @param varName
 * @param callback
 */
dbr.printVal = function(debugId,varName,callback){
    var gdb = gdbMap[debugId];
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(debugId+' PRINT resolve');
        //console.log('read complete-----------------\n'+batch);
        //console.log('-------------------------------\n');

        //parse函数的名称
        var parseNames = methods['printVal'].parseNames;
        doParses(batch,parseNames,function(err,result){
            callback(null, result);
        });
    });

    gdb.stdin.write('p '+varName+'\n');
};

/**
 * 根据传入的parse函数的名称数组逐个解析，返回第一个解析成功的结果
 * @param batch
 * @param parseNames
 * @param finish
 */
function doParses(batch,parseNames,finish){
    var result = null;
    for(var i=0; i<parseNames.length; i++){
        var funcName = parseNames[i];
        result = parser[funcName](batch);
        if(result){
            finish(null, result);
            break;
        }
    }
}