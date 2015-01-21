var http = require('http');
var requestParser = require('./util/request_parser');
var dbr = require('./debugger');

http.createServer(function (req, res) {
    requestParser.parseRequest(req,function(err,body){
        if(err){
            return reply(res,err,500);
        }

        //debug请求
        if(body.debug){
            doDebug(body.debug,function(err,result){
                if(err){
                    return reply(res,err,500);
                }
                reply(res,result);
            });
        }
        //查值请求
        else if(body.printVal){
            doPrintVal(body.printVal,function(err,result){
                if(err){
                    return reply(res,err,500);
                }
                reply(res,result);
            });
        }
    });
}).listen(23333);

/**
 * 处理查值请求
 * @param param
 * @param callback
 */
function doPrintVal(param,callback){
    var debugId = param.debugId;
    var valName = param.valName;
    dbr.printVal(debugId,valName,function(err,result){
        callback(err,result);
    });
}

/**
 * 处理debug请求
 * @param param debug请求参数
 * @param callback 处理完成后的回调函数
 */
function doDebug(param,callback){
    var programName = param.programName;
    var breakLine  = param.breakLine;

    dbr.debug(programName,breakLine,function(err,debugId){
        if(err) return callback(err);

        callback(null, {"debugId":debugId});
    });
}

/**
 * 将响应json写回http响应对象中
 * @param res http的response对象
 * @param object 要写入的响应json对象
 * @param code 返回码，默认200
 */
function reply(res, object, code){
    var responseCode = code || 200;
    var reply = "";

    if(responseCode === 200)
        reply = JSON.stringify(object);
    else
        reply = object.toString();

    //将执行结果转成json字符串返回
    res.writeHead(responseCode, {'Content-Type': 'application/json'});
    res.end(reply+'\n');
}