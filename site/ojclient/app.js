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
    sendRequest.call(this,"",{
        "srcCode":srcCode,
        "srcType":srcType,
        "inputData":inputData
    },null,function(err,body){
        if(err) return callback(err);

        if(!body.result || !body.params) {
            console.log(body);
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
 * 设置runner的主机位置
 * @param host
 */
runner.setHost = function(host){
    this.host = host;
};

/**
 * 一个便利方法，组合了ebug+breakPoint+run操作
 * @param srcCode
 * @param srcType
 * @param inputData
 * @param breakPoints
 * @param callback callback(err,debugId,exit,breakPoint)
 * exit:是否结束的flag   breakPoint:遇到的断点信息
 */
dbr.launchDebug = function(srcCode,srcType,inputData,breakPoints,callback){
    var debugId = null;

    //开启debug会话
    Q.denodeify(dbr.debug)(srcCode,srcType,inputData)
        //打断点
        .then(function(createdDebugId){
            debugId = createdDebugId;
            if(breakPoints && breakPoints.length > 0)
                return Q.denodeify(dbr.breakPoint)(debugId,breakPoints);
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
        })
        .done();
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
    sendRequest.call(dbr,"debug",{
        "srcCode":srcCode,
        "srcType":srcType,
        "inputData":inputData
    },null,function(err,result,setCookie){
        if(err) return callback(err);
        if(!result.debugId)
            return callback(new Error('异常返回值'+JSON.stringify(result)));

        //保存debugId与cookie文本的映射
        cookieMap[result.debugId] = setCookie;

        callback(null,result.debugId);
    });
};

/**
 * 添加断点
 * @param debugId
 * @param breakPoints 断点行数数组
 * @param callback callback(err,breakPointNum)
 */
dbr.breakPoint = function(debugId,breakPoints,callback){
    sendRequest.call(dbr,"breakPoint",{
            "debugId":debugId,
            "breakPoints":breakPoints
        },debugId,function(err,result){
            if(err) return callback(err);

            if(result.breakPointNum === undefined)
                return callback(new Error('异常返回值'+JSON.stringify(result)));

            callback(null,result.breakPointNum);
        });
};

/**
 * 移除断点
 * @param debugId
 * @param breakPoints 要移除断点的行数的数组
 * @param callback callback(err,breakPointNum)
 */
dbr.removeBreakPoint = function(debugId,breakPoints,callback){
    sendRequest.call(dbr,"removeBreakPoint",{
            "debugId":debugId,
            "breakPoints":breakPoints
        },debugId,function(err,result){
            if(err) return callback(err);

            if(result.breakPointNum === undefined)
                return callback(new Error('异常返回值'+JSON.stringify(result)));

            callback(null,result.breakPointNum);
        });
};

dbr.finishFunction = function(debugId,callback){
    sendRequest.call(dbr,"finishFunction",{
        "debugId":debugId
    },debugId,function(err,result){
        if(err) return callback(err);

        if(result.finished === undefined || result.finished.lineNum == undefined)
            return callback(new Error('异常返回值'+JSON.stringify(result)));

        callback(null,result.finished.lineNum);
    });
};

/**
 * 打印变量的值
 * @param debugId
 * @param varName
 * @param callback callback(err,value)
 */
dbr.printVal = function(debugId,varName,callback){
    sendRequest.call(dbr,"printVal",{
            "debugId":debugId,
            "varName":varName
        },debugId,function(err,result){
            if(err) return callback(err);

            if(result.noSymbol){
                return callback(new Error('变量'+varName+'不存在'));
            }

            if(!result.var || !result.var.value)
                return callback(new Error('异常返回值'+JSON.stringify(result)));

            callback(null,result.var.value);
        });
};

/**
 * 取得局部变量的值
 * @param debugId
 * @param callback callback(err,locals)
 */
dbr.locals = function(debugId,callback){
    sendRequest.call(dbr,"locals",{
            "debugId":debugId
        },debugId,function(err,result){
            if(err) return callback(err);
            if(!result.locals){
                return callback(new Error('异常返回值'+JSON.stringify(result)));
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
    sendRequest.call(dbr,"exit",{
        "debugId": debugId
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
 * 设置debugger的主机位置
 * @param host
 */
dbr.setHost = function(host){
    this.host = host;
};

/**
 * 建立与运行相关的方法（run,continue,stepInto,stepOver），因为他们的逻辑是一样的
 * 回调函数的格式统一为： callback(err,finish,breakPoint,stdout,locals)
 */
var methodNames = ['run','continue','stepInto','stepOver'];
methodNames.forEach(function(methodName){
    dbr[methodName] = function(debugId,callback){
        var requestObj = {
            "debugId":debugId
        };
        sendRequest.call(dbr,methodName,requestObj,debugId,function(err,result){
            if(err) return callback(err);

            var stdout = result.stdout;
            var locals = result.locals;

            //断点信息
            var breakPoint = result.breakPoint;
            if(breakPoint)
                return callback(null,false,breakPoint,stdout,locals);

            //退出信息
            var exit = result.normalExit;
            if(exit){
                return callback(null,true,null,stdout,locals);
            }

            //超出调试范围
            var outOfRange = result.endSteppingRange || result.noFileOrDirectory;
            if(outOfRange){
                return callback(null,true);
            }

            //debug执行错误
            var notRunning = result.notRunning;
            if(notRunning){
                return callback(new Error('程序未运行'));
            }

            //如果都不是就直接返回错误
            callback(new Error('异常返回值'+JSON.stringify(result)));
        });
    }
});

/**
 * 向debugger服务器发出请求，并接收返回值
 * @param method {string} 要向服务器提交的操作
 * @param body {object} 请求主体
 * @param cookieId {string} 该请求所对应的cookieId，用于定位其所对应的服务器。
 * 为null表示使用默认分配（使用HAProxy的情况下）
 * 目前cookieId即debugId
 * @param callback {function}
 */
function sendRequest(method,body,cookieId,callback){
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
    +':'+(this.port||'23333')+"/"+method;
    requestObj.body = body;

    //发送请求，返回获取的结果
    request(requestObj, function (err, response, body) {
        //这里发生错误表示是通讯发生了问题，仅对外提示通讯异常
        if(err){
            console.error(err);
            return callback(new Error('内部通讯异常'));
        }

        //如果返回的报文表示不成功，返回错误信息
        if(response.statusCode != 200){
            console.error(body);
            //return callback(new Error('编译执行错误'));
            return callback(new Error(body));
        }

        //如果有来自负载均衡的setCookie请求，则回传要设置的cookie信息，做好相应的保存以备下次使用
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