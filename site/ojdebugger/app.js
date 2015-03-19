#!/usr/bin/nodejs
/**
 * ojdebugger入口
 */
var http = require('http');
var Q = require('q');
var requestParser = require('./util/request_parser');
var controller = require('./core/controller');
var util = require('./util/util');
var config = require('./config/config').settings;

//请求队列
var RequestQueue = require('./util/request_queue').RequestQueue;
//初始化队列，设置回调函数
var queue = new RequestQueue([heartBeat,perform]);

//准备好各种临时文件需要的目录
util.prepareDir();

//开启debug模式
Q.longStackSupport = true;

var port = config.app.port;
http.createServer(function (req, res) {
    //将req,res加入队列，等调度到该次请求的时候再把req,res传给配置好的回调函数
    queue.push(req, res);

}).listen(port,function(){
    console.log('debugger服务器已启动');
});

function perform(req,res,next){
    Q.denodeify(requestParser.parseRequest)(req)
        .then(function(body){
            return Q.denodeify(controller.dispatch)(body);
        })
        .then(function(result){
            reply(res,result);
        })
        .catch(function(err){
            reply(res,err,500);
        })
        .finally(function(){
            next();
        })
        .done();
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
        //到这里的主要是error对象，将其序列化方便看出来错误的内容
        reply = object.toString();

    //将执行结果转成json字符串返回
    res.writeHead(responseCode, {'Content-Type': 'application/json'});
    res.end(reply+'\n');
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
