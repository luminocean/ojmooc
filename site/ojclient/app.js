/**
 * oj客户端的主程序
 * 主要功能：
 * 1、封装ojdebugger提供的接口，对使用者提供更容易使用的接口
 * 2、组合多个底层接口，提供一些便利接口
 * 3、对某些返回值进行一定处理，对使用者更友好
 */
var request = require('request');
var Q = require('q');

/**
 * debugId与对应服务器的cookie的映射关系
 */
var cookieMap = {};

//debug设置
Q.longStackSupport = true;

//对外提供的ojrunner客户端对象
var runner = {};
exports.runner = runner;

//对外提供的ojdebugger客户端对象
var dbr = {};
exports.debugger = dbr;

/**
 * oj的编译执行接口，返回执行的结果以及相关的运行参数
 * @param srcCode
 * @param srcType
 * @param inputData
 * @param callback callback(err,result,params)
 */
runner.run = function(srcCode,srcType,inputData,callback){
    sendRequest.call(this,{
        "srcCode":srcCode,
        "srcType":srcType,
        "inputData":inputData
    },null,function(err,body){
        if(err){
            console.log(err.stack);
            console.log(err);
            return callback(err);
        }
        if(!body.result || !body.params) {
            console.error(body);
            return callback(new Error('返回值中没有运行结果或者运行参数'));
        }

        callback(null,body.result,body.params,body.host);
    });
};

/**
 * 设置runner端口
 * @param port
 */
runner.setPort = function(port){
    this.port = port;
};


/**
 * 一个便利方法，组合了ebug+breakPoint+run操作
 * @param srcCode
 * @param srcType
 * @param inputData
 * @param breakLines
 * @param callback callback(err,debugId,exit,breakPoint)
 * exit:是否结束的flag   breakPoint:遇到的断点信息
 */
dbr.launchDebug = function(srcCode,srcType,inputData,breakLines,callback){
    var debugId = null;

    //开启debug会话
    Q.denodeify(dbr.debug)(srcCode,srcType,inputData)
        //打断点
        .then(function(createdDebugId){
            debugId = createdDebugId;
            return Q.denodeify(dbr.breakPoint)(debugId,breakLines);
        })
        //启动程序
        .then(function(){
            return Q.denodeify(dbr.run)(debugId);
        })
        //获取结果
        .then(function(results){
            var exit = results[0];
            var breakPoint = results[1];
            var stdout = results[2];
            var locals = results[3];

            callback(null,debugId,exit,breakPoint,stdout,locals);
        })
        //处理异常
        .catch(function(err){
            console.error(err.stack);
            callback(err);
        });
};

/**
 * 开启一个debug会话
 * @param srcCode
 * @param srcType
 * @param inputData
 * @param callback callback(err,debugId)
 */
dbr.debug = function(srcCode,srcType,inputData,callback){
    //开启debug
    sendRequest.call(dbr,{
        "debug":{
                "srcCode":srcCode,
                "srcType":srcType,
                "inputData":inputData
            }
        },null,function(err,result,setCookie){
            if(err) return callback(err);
            if(!result.debugId)
                return console.error(new Error('异常返回值'+JSON.stringify(result)));

            //保存debugId与cookie文本的映射
            cookieMap[result.debugId] = setCookie;

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
    sendRequest.call(dbr,
            {"breakPoint":{
                "debugId":debugId,
                "breakLines":breakLines
            }
        },debugId,function(err,result){
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
    sendRequest.call(dbr,
        {
            "printVal":{
                "debugId":debugId,
                "varName":varName
            }
        },debugId,function(err,result){
            if(err) return callback(err);
            if(result.noSymbol){
                return callback(new Error('变量'+varName+'不存在'));
            }

            if(!result.var || !result.var.value)
                return console.error(new Error('异常返回值'+JSON.stringify(result)));

            callback(null,result.var.value);
        });
};

/**
 * 取得局部变量的值
 * @param debugId
 * @param callback callback(err,locals)
 */
dbr.locals = function(debugId,callback){
    sendRequest.call(dbr,
        {
            "locals":{
                "debugId":debugId
            }
        },debugId,function(err,result){
            if(err) return callback(err);
            if(!result.locals){
                return console.error(new Error('*异常返回值'+JSON.stringify(result)));
            }

            callback(null,result.locals);
        });
};

/**
 * 结束debug
 * @param debugId
 * @param callback callback(err,debugId)
 */
dbr.exit = function(debugId,callback){
    sendRequest.call(dbr,{
        "exit": {
            "debugId": debugId
        }
    },debugId,function(err,result){
        if(err) return callback(err);

        callback(null,result.debugId);
    });
};

/**
 * 设置debugger的端口
 * @param port
 */
dbr.setPort = function(port){
    this.port = port;
};

/**
 * 建立与运行相关的方法（run,continue,stepInto,stepOver），因为他们的逻辑是一样的
 * 回调函数的格式统一为： callback(err,exit,breakPoint,stdout,locals)
 */
var methodNames = ['run','continue','stepInto','stepOver'];
methodNames.forEach(function(methodName){
    dbr[methodName] = function(debugId,callback){
        var requestObj = {};
        requestObj[methodName] = {
            "debugId":debugId
        };
        sendRequest.call(dbr,requestObj,debugId,function(err,result){
            if(err) return callback(err);

            var stdout = result.stdout;
            var originLocals = result.locals;
            var locals = null;
            //调整locals返回值的格式
            if(originLocals){
                locals = {};
                var varNames = originLocals.varName;
                var varVals = originLocals.varVal;
                for(var i=0;i<varNames.length;i++){
                    locals[varNames[i]] = varVals[i];
                }
            }

            if(result.breakPoint)
                return callback(null,false,result.breakPoint,stdout,locals);

            if(result.normalExit)
                return callback(null,true,result.normalExit,stdout,locals);

            callback(new Error('异常返回值'+JSON.stringify(result)));
        });
    }
});

/**
 * 向debugger服务器发出请求，并接收返回值
 * @param body 请求主体
 * @param cookieId 该请求所对应的cookieId，用于定位其所对应的服务器。
 * 为null表示使用默认分配（使用HAProxy的情况下）
 * 目前cookieId即debugId
 * @param callback
 */
function sendRequest(body,cookieId,callback){
    var requestObj = {
        "method":"POST",
        "json":true
    };

    //设置对应的cookie用于定位到特定的服务器上
    if(cookieId && cookieMap[cookieId]){
        var cookie = cookieMap[cookieId];
        requestObj.headers = {
            "Cookie": cookie
        }
    }

    //拼出请求服务器的url，如果没有提供则设置为默认值
    requestObj.url = 'http://'+(this.host||'localhost')
        +':'+(this.port||'23333');
    requestObj.body = body;

    //发送请求，返回获取的结果
    request(requestObj, function (err, response, body) {
        if(err)
            return callback(err);

        var setCookieHeader = response.headers['set-cookie'];
        var setCookie = null;
        if(setCookieHeader && setCookieHeader.length){
            var pieces = setCookieHeader[0].split(";");
            if(pieces.length > 0){
                setCookie = pieces[0];
            }
        }

        callback(null,body,setCookie);
    });
}