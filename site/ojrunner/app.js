/**
 * 服务器入口，负责启动服务器，并将编译执行请求解析后传给具体业务逻辑模块
 */
var http = require('http');
var requestParser = require('./util/request_parser');
var run = require('./core/run');

/**
 * 服务器处理的入口方法
 * @param req 执行请求
 * @param res 执行结果
 */
var serverPerform = function(req,res){
    //解析请求，获取解析后的POST报文体
    requestParser.parseRequest(req,function(err, body){
        if(err)
            return console.error(err);

        //从报文体中取出请求参数
        var srcType = body.srcType;
        var srcCode = body.srcCode;
        var inputData = body.inputData;

        //交由业务逻辑执行，取得结果
        run.run(srcCode,inputData,srcType,function(err, result, params){
            if(err){
                var errMsg = {};
                errMsg.errMessage = err.message;

                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(errMsg)+'\n');
                return;
            }

            var resultJson = {};
            resultJson.result = result;
            resultJson.params = params;

            //将执行结果转成json字符串返回
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(resultJson)+'\n');
        });
    });
};

//启动服务器，指定绑定端口
http.createServer(serverPerform).listen(23333,function(){
    console.log('服务器已启动');
});

process.on('uncaughtException',function(err){
    console.error(err);
});