/**
 * ojdebugger入口
 */
var http = require('http');
var Q = require('q');
var requestParser = require('./util/request_parser');
var controller = require('./core/controller');
var util = require('./util/util');

//请求队列
var RequestQueue = require('./util/request_queue').RequestQueue;
//初始化队列，设置回调函数
var queue = new RequestQueue([perform]);

//准备好各种临时文件需要的目录
util.prepareDir();

http.createServer(function (req, res) {
    //将req,res加入队列，等调度到该次请求的时候再把req,res传给配置好的回调函数
    queue.push(req, res);

}).listen(23333,function(){
    console.log('debugger服务器已启动');
});

function perform(req,res,next){
    Q.denodeify(requestParser.parseRequest)(req)
        .then(function(body){
            return Q.denodeify(controller.process)(body);
        })
        .then(function(result){
            reply(res,result);
            next();
        })
        .catch(function(err){
            reply(res,err,500);
            next();
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