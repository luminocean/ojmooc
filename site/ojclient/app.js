/**
 * oj客户端的主程序，只要负责发出传入的参数，从后台的oj服务器获取运行的结果并返回调用方
 */
var request = require('request');

//对外提供的ojrunner客户端对象
var runner = {};
exports.runner = runner;

//对外提供的ojdebugger客户端对象
var dbr = {};
exports.debugger = dbr;

/**
 * 设置runner端口，否则会使用默认值
 * @param port
 */
runner.setPort = function(port){
    this.port = port;
};
/**
 * oj的编译执行接口，返回执行的结果以及相关的运行参数
 * @param srcCode
 * @param srcType
 * @param inputData
 * @param callback
 */
runner.run = function(srcCode,srcType,inputData,callback){
    sendRequest.call(this,{
        "srcCode":srcCode,
        "srcType":srcType,
        "inputData":inputData
    },function(err,body){
        if(err){
            console.log(err.stack);
            console.log(err);
            return callback(err);
        }

        callback(null,body);
    });
};


/**
 * 设置debugger的端口，否则使用默认值
 * @param port
 */
dbr.setPort = function(port){
    this.port = port;
};

/**
 * 一个便利方法，等同于debug+breakPoint+run操作
 * @param programName
 * @param breakLines
 * @param callback callback(err,debugId,exit,breakPoint)
 * exit:是否结束的flag   breakPoint:遇到的断点信息
 */
dbr.launchDebug = function(programName,breakLines,callback){
    dbr.debug(programName,function(err,debugId){
        if(err) return callback(err);

        dbr.breakPoint(debugId,breakLines,function(err){
            if(err) return callback(err);

            dbr.run(debugId,function(err,exit,breakPoint){
                if(err) return callback(err);

                callback(null,debugId,exit,breakPoint);
            });
        });
    });
};

/**
 * 开启一个debug会话
 * @param srcCode
 * @param srcType
 * @param inputData
 * @param callback
 */
dbr.debug = function(srcCode,srcType,inputData,callback){
    //开启debug
    sendRequest.call(this,{
        "debug":{
                "srcCode":srcCode,
                "srcType":srcType,
                "inputData":inputData
            }
        },function(err,result){
            if(err) return callback(err);
            if(!result.debugId)
                return console.error(new Error('异常返回值'+JSON.stringify(result)));

            callback(null,result.debugId);
        });
};

/**
 * 添加断点
 * @param debugId
 * @param breakLines 断点行数数组
 * @param callback callback(err,breakPointNum)
 */
dbr.breakPoint = function(debugId,breakLines,callback){
    sendRequest.call(this,
            {"breakPoint":{
                "debugId":debugId,
                "breakLines":breakLines
            }
        },function(err,result){
            if(err) return callback(err);
            if(!result.breakPointNum)
                return console.error(new Error('异常返回值'+JSON.stringify(result)));

            callback(null,result.breakPointNum);
        });
};

/**
 * 打印变量的值
 * @param debugId
 * @param varName
 * @param callback callback(err,value)
 */
dbr.printVal = function(debugId,varName,callback){
    sendRequest.call(this,
        {
            "printVal":{
                "debugId":debugId,
                "varName":varName
            }
        },function(err,result){
            if(err) return callback(err);
            if(!result.var || !result.var.value)
                return console.error(new Error('异常返回值'+JSON.stringify(result)));

            callback(null,result.var.value);
        });
};

/**
 * 执行一个debug会话，取得执行结果（遇到断点或者运行结束）
 * @param debugId
 * @param callback callback(err,exit,breakPoint)
 * exit:是否结束的flag   breakPoint:遇到的断点信息
 */
dbr.run = function(debugId,callback){
    sendRequest.call(this,{
        "run":{
            "debugId":debugId
        }
    },function(err,result){
        if(err) return callback(err);
        if(result.breakPoint)
            return callback(null,false,result.breakPoint);

        if(result.normalExit)
            return callback(null,true,result.normalExit);

        console.error(new Error('异常返回值'+JSON.stringify(result)));
    });
};

/**
 * 单步进入
 * @param debugId
 * @param callback callback(err,exit,breakPoint)
 * exit:是否结束的flag   breakPoint:遇到的断点信息
 */
dbr.stepInto = function(debugId,callback){
    sendRequest.call(this,{
        "stepInto": {
            "debugId": debugId
        }
    },function(err,result){
        if(err) return callback(err);
        if(result.breakPoint)
            return callback(null,false,result.breakPoint);

        if(result.normalExit)
            return callback(null,true,result.normalExit);

        console.error(new Error('异常返回值'+JSON.stringify(result)));
    });
};

/**
 * 单步跨越
 * @param debugId
 * @param callback callback(err,exit,breakPoint)
 * exit:是否结束的flag   breakPoint:遇到的断点信息
 */
dbr.stepOver = function(debugId,callback){
    sendRequest.call(this,{
        "stepOver": {
            "debugId": debugId
        }
    },function(err,result){
        if(err) return callback(err);
        if(result.breakPoint)
            return callback(null,false,result.breakPoint);

        if(result.normalExit)
            return callback(null,true,result.normalExit);

        console.error(new Error('异常返回值'+JSON.stringify(result)));
    });
};

/**
 * 继续
 * @param debugId
 * @param callback callback(err,exit,breakPoint)
 * exit:是否结束的flag   breakPoint:遇到的断点信息
 */
dbr.continue = function(debugId,callback){
    sendRequest.call(this,{
        "continue": {
            "debugId": debugId
        }
    },function(err,result){
        if(err) return callback(err);
        if(result.breakPoint)
            return callback(null,false,result.breakPoint);

        if(result.normalExit)
            return callback(null,true,result.normalExit);

        console.error(new Error('异常返回值'+JSON.stringify(result)));
    });
};

/**
 * 结束debug
 * @param debugId
 * @param callback
 */
dbr.exit = function(debugId,callback){
    sendRequest.call(this,{
        "exit": {
            "debugId": debugId
        }
    },function(err,result){
        if(err) return callback(err);

        callback(null,result.debugId);
    });
};

/**
 * 向debugger服务器发出请求，并接收返回值
 * @param body
 * @param callback
 */
function sendRequest(body,callback){
    var requestObj = {
        "method":"POST",
        "json":true
    };
    //拼出请求服务器的url，如果没有提供则设置为默认值
    requestObj.url = 'http://'+(this.host||'localhost')
        +':'+(this.port||'23333');
    requestObj.body = body;

    //发送请求，返回获取的结果
    request(requestObj, function (err, response, body) {
        if(err)
            return callback(err);

        callback(null,body);
    });
}