/**
 * docker内部的服务器
 * 用于接收请求，执行编译完的程序，返回运行结果等参数
 * 带有请求缓冲的功能，避免大量请求涌入出现问题
 */
var http = require('http');
var requestParser = require('./core/request_parser');
var exec = require('./core/exec');

//启动服务器，指定绑定端口
http.createServer(serverPerform)
    .listen(23333);

/**
 * 服务器处理的入口方法
 * @param req 执行请求
 * @param res 执行结果
 */
function serverPerform(req,res){
    //从req中解析出执行请求的参数
    requestParser.parseRequest(req,function(err, body){
        if(err)
            return console.error(err);

        var programName = body.program;
        var inputData = body.data;

        //使用解析到的请求参数执行编译后的程序
        exec.exec(programName, inputData, function(err, result, params){
            var resultJson = {};
            resultJson.result = result;
            resultJson.params = params;

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(resultJson)+'\n');
        });
    });
}

/**
 * 防止进程崩溃的措施
 */
process.on('uncaughtException',function(err){
    console.error(err);
});