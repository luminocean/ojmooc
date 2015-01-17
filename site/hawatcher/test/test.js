/**
 * 本文件为测试用例，将模拟的用户输入数据通过http传到docker内的服务器，执行完毕后返回处理结果
 */
var request = require('request');

//准备请求的数据
var requestObj = {
    //这里直接访问HAProxy做负载均衡
    "url":"http://localhost:8080",
    "method":"POST",
    "json":true,
    "body":{}
};

requestObj.body.heartBeat = "Are you alive?";

for(var i=0; i<10; i++){
    //发送执行请求，获取执行结果
    request(requestObj,function(error, response, body){
        console.log(body);
    });
}



