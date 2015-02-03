/**
 * gdb封装模块，与gdb直接交互
 */
var path = require('path');
var fs = require('fs');
var cp = require('child_process');
var Q = require('q');
var compiler = require('./compiler');
var parser = require('./parser');
var util = require('../util/util');
var methods = require('../config/config').methods;
var config = require('../config/config').settings;

//debugger对象
var dbr = {};
module.exports = dbr;

//存放所有gdb进程的map对象
var gdbMap = {};

var srcPath = path.join(__dirname, '../', config.repo.dir.src);
var buildPath = path.join(__dirname, '../', config.repo.dir.build);
var inputPath = path.join(__dirname, '..', config.repo.dir.input);
var outputPath = path.join(__dirname, '..', config.repo.dir.output);

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
                processBatch(batch,debugId,parseNames,methodConfig.stdout,callback);
            });

            //向gdb进程传入指令
            gdb.stdin.write(methodConfig.command+' \n');
        };
    })(methodName,methodConfig);
}

//以下的均为非常规的debugger方法，即配置时未指定command属性，实现需要自行定义
/**
 * 开启一个debug会话
 * @param srcCode
 * @param srcType
 * @param inputData
 * @param callback
 */
dbr.debug = function(srcCode,srcType,inputData,callback){
    var debugId = util.genDebugId();
    var programName = debugId;

    //构造源程序文件名和路径
    var srcName = programName+'.'+srcType;
    var srcFilePath = path.join(srcPath, srcName);
    var buildFilePath = null;

    //生成源文件
    Q.denodeify(fs.writeFile)(srcFilePath, srcCode)
        //写入输入数据
        .then(function(){
            //构造源程序文件名和路径
            var inputName = programName+'.txt';
            var inputFilePath = path.join(inputPath, inputName);
            return Q.denodeify(fs.writeFile)(inputFilePath, inputData);
        })
        //编译文件
        .then(function(){
            //构造可执行程序的路径
            buildFilePath = path.join(buildPath,programName);
            return Q.denodeify(compiler.compile)(srcType, srcFilePath, buildFilePath);
        })
        //编译成功后执行
        .then(function(){
            //开启gdb子进程
            var gdb = cp.spawn('gdb',['--interpreter=mi',buildFilePath]);
            gdbMap[debugId] = gdb;

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

            //读完一批数据触发batch事件，进行输出的处理操作
            gdb.stdout.on('batch',function(){
                console.log(" DEBUG resolve");

                var result = methods['debug'].result||{};
                result.debugId = debugId;
                callback(null, result);
            });
        })
        .catch(function(err){
            console.error(err);
            console.error(err.stack);
            callback(err);
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
 * 启动运行操作
 * @param debugId
 * @param callback
 * @returns {*}
 */
dbr.run = function(debugId,callback){
    var gdb = gdbMap[debugId];
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    var methodConfig = methods['run'];

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(debugId+' RUN resolve');
        //console.log('read complete-----------------\n'+batch);
        //console.log('-------------------------------\n');

        //parse函数的名称
        var parseNames = methodConfig.parseNames;

        processBatch(batch,debugId,parseNames,methodConfig.stdout,callback);
    });

    var runCommand = 'r '
        //输入数据重定向
        +' <'+path.join(__dirname,'../',config.repo.dir.input,debugId+'.txt')
        //输出数据重定向
        +' >'+path.join(__dirname,'../',config.repo.dir.output,debugId+'.txt')
        +'\n';

    gdb.stdin.write(runCommand);
};

/**
 * 结束debug会话
 * @param debugId
 * @param callback
 */
dbr.exit = function(debugId,callback){
    var gdb = gdbMap[debugId];
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    gdb.on('exit',function(){
        delete gdb[debugId];
        var result = methods['exit'].result;
        result.debugId = debugId;

        callback(null,result);
    });

    gdb.stdin.write('q \n');
};

/**
 * 处理batch数据，将处理完的结果传入回调函数
 * @param batch 获取的gdb输出数据
 * @param debugId 当前debug会话的id
 * @param parseNames 用于解析的函数名称
 * @param withStdout 是否要在结果上加上标准输出的值
 * @param callback 要把结果输出的回调函数
 */
function processBatch(batch,debugId,parseNames,withStdout,callback){
    //解析gdb输出
    Q.denodeify(doParses)(batch,parseNames)
        .then(function(result){
            //将程序本身的标准输出结果加到结果对象上
            if(withStdout)
                return Q.denodeify(appendStdout)(result,debugId);
            return result;
        })
        //返回结果
        .then(function(result){
            return callback(null,result);
        })
        //截获出错结果
        .catch(function(err){
            console.error(err);
            console.error(err.stack);
            return callback(err);
        });
}
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

/**
 * 给result对象加上该程序标准输出的结果，从而可以返回给客户端
 * @param result
 * @param debugId
 * @param callback
 */
function appendStdout(result,debugId,callback){
    //构造标准输出文件路径
    var outputFilePath = path.join(outputPath,debugId+'.txt');

    //判断输出文件是否存在
    fs.exists(outputFilePath,function(exists){
        //如果文件本身不存在则直接返回
        if(!exists){
            result.stdout = '';
            return callback(null,result);
        }

        //读出标准输出
        Q.denodeify(fs.readFile)(outputFilePath)
            .then(function(data){
                //append到result上
                result.stdout = data.toString();
                //清空标准输出
                return Q.denodeify(fs.writeFile)(outputFilePath,'');
            })
            .then(function(){
                //返回结果
                callback(null,result);
            })
            .catch(function(err){
                callback(err);
            });
    });
}