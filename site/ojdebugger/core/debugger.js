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

//存放所有gdb进程的对象
var gdbContainer = {
    "gdbMap":{},
    "timeoutMap":{},
    /**
     * 将gdb进程对象放入map中
     * @param debugId
     * @param gdb
     */
    "put":function(debugId,gdb){
        this.gdbMap[debugId] = gdb;
        this.initTimeout(debugId);
    },
    /**
     * 根据debugId获取debugId对应的gdb进程对象
     * 同时重置对应的计时器。一旦超时改gdb进程将会被退出
     * @param debugId
     */
    "fetch":function(debugId){
        this.initTimeout(debugId);
        return this.gdbMap[debugId];
    },
    /**
     * 初始化gdb的超时时间，然后每秒递减直到超时
     * @param debugId
     */
    "initTimeout":function(debugId){
        if(this.gdbMap[debugId]){
            this.timeoutMap[debugId] = config.app.gdbTimeout;
        }
    },
    /**
     * 递减gdb时间，如果小于0则回收该gdb进程
     * @param debugId
     */
    "decrease":function(debugId){
        if(this.gdbMap[debugId] && (this.timeoutMap[debugId] !== undefined)){
            var timeout = --this.timeoutMap[debugId];
            //超时
            if(timeout < 0){
                this.clear(debugId);
            }
        }
    },
    /**
     * 退出gdb进程，清除map数据
     * @param debugId
     */
    "clear":function(debugId){
        //退出gdb进程
        dbr.exit(debugId,function(err/*,result*/){
            if(err) throw err;
            //console.log(result);
        });
        delete this.gdbMap[debugId];
        delete this.timeoutMap[debugId];
    },
    /**
     * 把每个debugId对应的时间递减，并退出超时的进程
     * 每个周期执行一次
     */
    "tick":function(){
        var ids = [];
        for(var debugId in this.gdbMap){
            if(!this.gdbMap.hasOwnProperty(debugId)) continue;
            ids.push(debugId);
        }
        var that = this;
        ids.forEach(function(debugId){
            that.decrease(debugId);
            //console.log('剩余时间：'+that.timeoutMap[debugId]);
        });
    }
};

//每秒tick一次
setInterval(function(){
    gdbContainer.tick();
},1000);

var srcPath = util.absPath(config.repo.dir.src);
var buildPath = util.absPath(config.repo.dir.build);
var inputPath = util.absPath(config.repo.dir.input);
var outputPath = util.absPath(config.repo.dir.output);

//使用配置对象自动构建常规的debugger方法
for(var methodName in methods){
    if(!methods.hasOwnProperty(methodName)) continue;

    var methodConfig = methods[methodName];
    //如果配置了command属性表示需要自动生成则继续
    if(!methodConfig.command) continue;

    (function(methodName,methodConfig){
        dbr[methodName] = function(debugId,callback){
            //取出gdb实例
            var gdb = gdbContainer.fetch(debugId);
            if(!gdb)
                return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

            //截获batch事件及其带来的数据
            gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
                console.log(debugId+' '+methodName+' resolve');
                //console.log('read complete-----------------\n'+batch);
                //console.log('-------------------------------\n');

                //配置好的parse函数的名称
                var parseNames = methodConfig.parseNames;
                processBatch(batch,debugId,parseNames,
                    methodConfig.stdout,methodConfig.locals,callback);
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
            gdbContainer.put(debugId,gdb);

            var data = '';
            gdb.stdout.on('data',function(chunk){
                data += chunk;

                //在读到的gdb输出中检索(gdb)分隔标记，每个标记前面的数据都构成一个batch
                var batchData = data.match(/([\s\S]*?)\(gdb\)\s*/);
                while(batchData){
                    //触发batch事件，发送数据
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
    var gdb = gdbContainer.fetch(debugId);
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    //添加断点操作后触发的相应的计数器，最后应该和断点的数目相同
    //表示所有的断点加入动作都被响应了
    var received = 0;
    //要返回的result对象的模板
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
    var gdb = gdbContainer.fetch(debugId);
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(debugId+' PRINT resolve');
        //console.log('read complete-----------------\n'+batch);
        //console.log('-------------------------------\n');

        //parse函数的名称
        var parseNames = methods['printVal'].parseNames;
        processBatch(batch,debugId,parseNames,false,false,callback);
    });

    gdb.stdin.write('p '+varName+'\n');
};

/**
 * 获取局部变量
 * @param debugId
 * @param callback
 * @returns {*}
 */
dbr.locals = function(debugId,callback){
    var gdb = gdbContainer.fetch(debugId);
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    var methodConfig = methods['locals'];

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(debugId+' LOCALS resolve');
        //console.log('read complete-----------------\n'+batch);
        //console.log('-------------------------------\n');

        //parse函数的名称
        var parseNames = methodConfig.parseNames;
        //locals参数必须是false
        processBatch(batch,debugId,parseNames,methodConfig.stdout,false,callback);
    });

    gdb.stdin.write('info locals \n');
};

/**
 * 启动运行操作
 * @param debugId
 * @param callback
 * @returns {*}
 */
dbr.run = function(debugId,callback){
    var gdb = gdbContainer.fetch(debugId);
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    var methodConfig = methods['run'];

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(debugId+' RUN resolve');
        //console.log('read complete-----------------\n'+batch);
        //console.log('-------------------------------\n');

        //parse函数的名称
        var parseNames = methodConfig.parseNames;

        processBatch(batch,debugId,parseNames,
            methodConfig.stdout,methodConfig.locals,callback);
    });

    //这里gdb的r命令需要使用特殊的写法，设置输入输出的重定向
    var runCommand = 'r '
        //输入数据重定向
        +' <'+path.join(util.absPath(config.repo.dir.input),debugId+'.txt')
        //输出数据重定向
        +' >'+path.join(util.absPath(config.repo.dir.output),debugId+'.txt')
        +'\n';

    gdb.stdin.write(runCommand);
};

/**
 * 结束debug会话
 * @param debugId
 * @param callback
 */
dbr.exit = function(debugId,callback){
    var gdb = gdbContainer.fetch(debugId);
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    gdb.on('exit',function(){
        console.log(debugId+' EXIT resolve');

        //清除数据,注意这里不能调用gdbContainer的clear方法，会造成循环调用
        delete gdbContainer.gdbMap[debugId];
        delete gdbContainer.timeoutMap[debugId];

        var result = methods['exit'].result;
        result.debugId = debugId;

        callback(null,result);

        util.cleanup(debugId,[srcPath,buildPath,inputPath,outputPath]);
    });

    gdb.stdin.write('q \n');
};

//以下为工具方法
/**
 * 解析batch数据，将处理完的结果传入回调函数
 * @param batch 获取的gdb输出数据
 * @param debugId 当前debug会话的id
 * @param parseNames 用于解析的函数名称
 * @param withStdout 是否要在结果上加上标准输出的值
 * @param withLocals 是否要在结果上加上局部变量集合
 * @param callback 要把结果输出的回调函数
 */
function processBatch(batch,debugId,parseNames,withStdout,withLocals,callback){
    //解析gdb输出
    Q.denodeify(doParses)(batch,parseNames)
        .then(function(result){
            //将程序本身的标准输出结果加到结果对象上
            if(withStdout)
                return Q.denodeify(appendStdout)(result,debugId);
            return result;
        })
        .then(function(result){
            //添加局部变量值
            if(withLocals && !result.exit )
                return Q.denodeify(appendLocals)(result,debugId);
            return result;
        })
        //返回结果
        .then(function(result){
            return callback(null,result);
        })
        //截获出错结果
        .catch(function(err){
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
        if(result && !result.info){
            return finish(null, result);
        }
    }

    //如果经过了所有的parser方法但是还是没有结果或者不是info类的结果
    //跑到这里则抛错
    if(!result || !result.info) {
        return finish(new Error('没有一个解析方法可以解析batch的内容\n'
            +'batch内容：'+batch));
    }

    //console.log(result);
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

/**
 * 给结果加上局部变量的统计值
 * @param result
 * @param debugId
 * @param callback
 */
function appendLocals(result,debugId,callback){
    //如果调试的程序已经退出则直接返回
    if(result.exit)
        return callback(null,result);

    dbr.locals(debugId,function(err,localsResult){
        if(err) callback(err);

        util.extend(result,localsResult);

        callback(null,result);
    });
}