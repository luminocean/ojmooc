/**
 * ojdebugger的客户端，用于封装与ojdebugger的交互，向使用者提供易于使用的接口
 */
var request = require('request');

var client = {};
module.exports = client;

/**
 * 一个便利方法，等同于debug+breakPoint+run操作
 * @param programName
 * @param breakLines
 * @param callback callback(err,debugId,exit,breakPoint)
 * exit:是否结束的flag   breakPoint:遇到的断点信息
 */
client.launchDebug = function(programName,breakLines,callback){
    client.debug(programName,function(err,debugId){
        if(err) return callback(err);

        client.breakPoint(debugId,breakLines,function(err){
            if(err) return callback(err);

            client.run(debugId,function(err,exit,breakPoint){
                if(err) return callback(err);

                callback(null,debugId,exit,breakPoint);
            });
        });
    });
};

/**
 * 开启一个debug会话
 * @param programName
 * @param callback callback(err,debugId)
 */
client.debug = function(programName,callback){
    //开启debug
    sendRequest(
        {"debug":
            {"programName":programName}
        },function(err,result){
            if(err) return console.error(err);
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
client.breakPoint = function(debugId,breakLines,callback){
    sendRequest(
        {"breakPoint":{
                "debugId":debugId,
                "breakLines":breakLines
            }
        },function(err,result){
            if(err) return console.log(err);
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
client.printVal = function(debugId,varName,callback){
    sendRequest(
        {
            "printVal":{
                "debugId":debugId,
                "varName":varName
             }
        },function(err,result){
            if(err) return console.log(err);
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
client.run = function(debugId,callback){
    sendRequest({
            "run":{
                "debugId":debugId
            }
        },function(err,result){
            if(err) return console.log(err);
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
client.stepInto = function(debugId,callback){
    sendRequest({
        "stepInto": {
            "debugId": debugId
        }
    },function(err,result){
        if(err) return console.log(err);
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
client.stepOver = function(debugId,callback){
    sendRequest({
        "stepOver": {
            "debugId": debugId
        }
    },function(err,result){
        if(err) return console.log(err);
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
client.continue = function(debugId,callback){
    sendRequest({
        "continue": {
            "debugId": debugId
        }
    },function(err,result){
        if(err) return console.log(err);
        if(result.breakPoint)
            return callback(null,false,result.breakPoint);

        if(result.normalExit)
            return callback(null,true,result.normalExit);

        console.error(new Error('异常返回值'+JSON.stringify(result)));
    });
};

/**
 * 向debugger服务器发出请求，并接收返回值
 * @param object
 * @param callback
 */
function sendRequest(object,callback){
    var requestObj = {
        "url":"http://localhost:23333",
        "method":"POST",
        "json":true,
        "body":object
    };
    request(requestObj, function (err, response, body) {
        if(err)
            return callback(err);

        callback(null,body);
    });
}