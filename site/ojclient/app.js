/**
 * oj客户端的主程序，只要负责发出传入的参数，从后台的oj服务器获取运行的结果并返回调用方
 */
var request = require('request');

//对外提供的客户端对象
var client = {};
module.exports = client;

/**
 * oj的编译执行接口，返回执行的结果以及相关的运行参数
 * @param srcCode
 * @param srcType
 * @param inputData
 * @param callback
 */
client.run = function(srcCode,srcType,inputData,callback){
    //准备请求的数据
    var requestObj = {
        //这里直接访问HAProxy做负载均衡
        "url":"http://localhost:8999",
        "method":"POST",
        "json":true,
        "body":{
            "srcCode":srcCode,
            "srcType":srcType,
            "inputData":inputData
        }
    };

    //发送执行请求，获取执行结果
    request(requestObj,function(err, response, body){
        if(err){
            console.log(err.stack);
            console.log(err);
            return callback(err);
        }

        callback(null,body);
    });
};