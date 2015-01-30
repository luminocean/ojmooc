/**
 * gdb封装模块
 */
var path = require('path');
var cp = require('child_process');
var parser = require('./parser');
var util = require('../util/util');

//debugger对象
var dbr = {};
module.exports = dbr;

//存放所有gdb进程的map对象
var gdbMap = {};

//用于快速构建模式化的debug方法所用的配置
//这里配置的都是简单方法，即入参都是debugId和callback函数，其中callback接受err和result两个参数
//不符合这样签名的复杂方法需要在后面定制
var debuggerMethods = {
    //gdb执行操作
    "run":{
        //log用的标识名称，主要给log使用
        "name":"RUN",
        //实际传给gdb执行的命令
        "command":"r",
        //获取gdb输出后用来处理该输出的handler
        "handler":proceedHandler
    },
    //继续操作
    "continue":{
        "name":"CONTINUE",
        "command":"c",
        "handler":proceedHandler
    },
    //单步进入操作
    "stepInto":{
        "name":"STEPINTO",
        "command":"step",
        "handler":proceedHandler
    },
    //单步越过操作
    "stepOver":{
        "name":"STEPOVER",
        "command":"next",
        "handler":proceedHandler
    }
};

//使用配置对象自动构建常规的debugger方法
for(var methodName in debuggerMethods){
    if(!debuggerMethods.hasOwnProperty(methodName)) continue;

    var methodConfig = debuggerMethods[methodName];

    (function(methodName,methodConfig){
        dbr[methodName] = function(debugId,callback){
            //取出gdb实例
            var gdb = gdbMap[debugId];
            if(!gdb)
                return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

            //截获batch事件及其带来的数据
            gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
                console.log(debugId+' '+methodConfig.name+' resolve');
                //console.log('read complete-----------------\n'+batch);
                //console.log('-------------------------------\n');

                //交给配置好的方法去解析
                methodConfig.handler(batch,function(err,result,exit){
                    if(err) callback(err);
                    if(result) callback(null,result);

                    //调试结束，结束当前的debug会话
                    if(exit){
                        gdb.kill('SIGTERM');
                    }
                });
            });

            //向gdb进程传入指令
            gdb.stdin.write(methodConfig.command+' \n');
        };
    })(methodName,methodConfig);
}

//以下的均为非常规的debugger方法，需要时请自行添加
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
        var result = {
            "debugId":debugId
        };

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

    gdb.stdout.removeAllListeners('batch').on('batch',function(){
        console.log(debugId+" BP resolve");

        received++;
        if(received === breakLines.length){
            callback(null,{
                "breakPointNum":breakLines.length
            });
        }
    });

    //加入断点
    if(!breakLines || breakLines.length==0) {
        callback(null, {"breakPoint": 0});
    }else{
        breakLines.forEach(function(lineNum){
            gdb.stdin.write('break '+lineNum+'\n');
        });
    }
};

/**
 * 查值操作
 * @param debugId
 * @param valName
 * @param callback
 */
dbr.printVal = function(debugId,valName,callback){
    var gdb = gdbMap[debugId];
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(debugId+' PRINT resolve');
        //console.log('read complete-----------------\n'+batch);
        //console.log('-------------------------------\n');

        var result = parser.parsePrintVal(batch);
        if(result){
            callback(null, result.value);
        }
    });

    gdb.stdin.write('p '+valName+'\n');
};

/**
 * 处理运行数据，程序运行结束或者到达断点后才返回结果
 * @param batch
 * @param finish
 * @returns {*}
 */
function proceedHandler(batch,finish){
    //如果到达了断点则返回断点信息
    var breakPointResult = parser.parseStopPoint(batch);
    if(breakPointResult)
        return finish(null,breakPointResult,false);

    //如果运行结束则返回结束信息
    var exitResult = parser.parseExit(batch);
    if(exitResult)
        return finish(null,exitResult,true);
}