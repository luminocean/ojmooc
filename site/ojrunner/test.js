/**
 * 本文件为测试用例，将模拟的用户输入数据通过http传到docker内的服务器，执行完毕后返回处理结果
 */
var fs = require('fs');
var request = require('request');

//测试的编译类型
var srcType = 'cpp';
//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/'+srcType+'_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/'+srcType+'_data','utf-8');

//准备请求的数据
var requestObj = {
    //这里直接访问HAProxy做负载均衡
    "url":"http://localhost:8999",
    "method":"POST",
    "json":true,
    "body":{}
};
requestObj.body.srcType = srcType;
requestObj.body.srcCode = srcCode;
requestObj.body.inputData = inputData;
//requestObj.body.heartBeat = "Are you alive?";

for(var i=0; i<5; i++){
    //发送执行请求，获取执行结果
    request(requestObj,function(error, response, body){
        console.log(body);
    });
}



