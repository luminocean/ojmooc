#!/usr/bin/nodejs
/**
 * 服务器入口，负责启动服务器，并将编译执行请求解析后传给具体业务逻辑模块
 */
var http = require('http');
var os = require('os');
var Q = require('q');
var requestParser = require('./util/request_parser');
var util = require('./util/util');
var config = require('./config/config');
var run = require('./core/run');

//初始化请求队列，设置回调函数
var RequestQueue = require('./util/request_queue').RequestQueue;
var queue = new RequestQueue([heartBeat,perform]);

//准备好各种临时文件需要的目录
util.prepareDir();
//开启debug模式
Q.longStackSupport =true;

var port = config.app.port;

//启动服务器，指定绑定端口
http.createServer(function(req,res){
    //将req,res加入队列，等调度到该次请求的时候再把req,res传给配置好的回调函数
    queue.push(req, res);

}).listen(port||23333,function(){
    console.log('runner服务器已启动');
});

/**
 * 执行服务器处理
 * @param req 请求对象
 * @param res 响应对象
 * @param next 处理下一个中间件，如果没有的话就处理下一个请求
 */
function perform(req,res,next){
    //解析请求
    Q.denodeify(requestParser.parseRequest)(req)
        //使用解析得到的参数编译执行
        .then(function (body) {
            //从报文体中取出请求参数
            var srcType = body.srcType;
            var srcCode = body.srcCode;
            var inputData = body.inputData;

            return Q.denodeify(run.run)(srcCode, inputData, srcType);
        })
        //取得结果返回客户端
        .then(function (results) {
            var resultJson = {};
            resultJson.result = results[0];
            resultJson.params = results[1];

            //将执行结果转成json字符串返回
            reply(res, resultJson);
        })
        //如果出错则返回错误
        .catch(function (err) {
            //输出错误记录
            console.error(err.stack);
            //发出响应
            reply(res, err, 500);
        })
        .finally(function(){
            next();
        })
        .done();
}

/**
 * 心跳响应中间件，负责响应心跳检测请求
 * @param req 请求对象
 * @param res 响应对象
 * @param next 处理下一个中间件，如果没有的话就处理下一个请求
 */
function heartBeat(req,res,next){
    requestParser.parseRequest(req,function(err, body){
        //如果请求是心跳检测，那么返回响应
        if(body.heartBeat){
            reply(res,{
                "isAlive":"I'm alive"
            });
            next(false);
        }else{
            //否则继续处理
            next();
        }
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

    object.host = os.hostname();

    if(responseCode === 200)
        reply = JSON.stringify(object);
    else
        reply = object.toString();

    //将执行结果转成json字符串返回
    res.writeHead(responseCode, {'Content-Type': 'application/json'});
    res.end(reply+'\n');
}
