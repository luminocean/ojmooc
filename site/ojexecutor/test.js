/**
 * 执行服务器的测试用例
 */
var request = require('request');

/**
 * 发送请求到服务器，取得运行结果等参数
 */
request({
    "url":"http://localhost:23333",
    "method":"POST",
    "json":true,
    //请求数据
    "body":{
        //要执行的程序名
        "program":"readme",
        //输入参数
        "data":"1\n2\n3"
    }
},function(error, response, body){
    console.log(body);
});
