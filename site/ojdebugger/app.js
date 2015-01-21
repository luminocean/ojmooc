var http = require('http');
var requestParser = require('./util/request_parser');
var controller = require('./core/controller');

http.createServer(function (req, res) {
    requestParser.parseRequest(req,function(err,body){
        if(err){
            return reply(res,err,500);
        }

        controller.process(body,function(err,result){
            if(err){
                return reply(res,err,500);
            }
            reply(res,result);
        });
    });
}).listen(23333);

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