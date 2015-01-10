/**
 * docker内部的服务器
 * 用于接收请求，执行编译完的程序，返回运行结果等参数
 * 带有请求缓冲的功能，避免大量请求涌入出现问题
 */
var http = require('http');
var path = require('path');
var requestParser = require('./util/request_parser');
var exec = require('./core/exec');
var util = require('./util/util');
var config = require('./config/config');

//报告文件所在位置
var reportPath = path.join(__dirname,config.repo.dir.report);

//启动服务器，指定绑定端口
http.createServer(serverPerform)
    .listen(23333,function(){
        console.log('服务器已启动');
    });

/**
 * 服务器处理的入口方法
 * @param req 执行请求
 * @param res 执行结果
 */
function serverPerform(req,res){
    //解析请求，获取解析后的POST报文体
    requestParser.parseRequest(req,function(err, body){
        if(err)
            return console.error(err);

        //从报文体中取出要执行的程序名与输入数据
        var programName = body.program;
        var inputData = body.data;

        //执行程序
        exec.exec(programName, inputData, function(err, result, params){
            if(err)
                return console.error(err);

            var resultJson = {};
            resultJson.result = result;
            resultJson.params = params;

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(resultJson)+'\n');

            util.cleanup(programName,[reportPath]);
        });
    });
}

/**
 * 防止进程崩溃的措施
 */
process.on('uncaughtException',function(err){
    console.error(err);
});