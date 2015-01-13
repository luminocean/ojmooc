var request = require('request');
var util = require('./util');
var logic = require('./logic');

//上次获取的容器列表
var lastContainers = [];

//准备请求的数据
var requestObj = {
    "url":"http://localhost:4243/containers/json",
    "method":"GET"
};
//发送执行请求，获取执行结果
request(requestObj,function(err, response, body){
    if(err){
        return console.error(err);
    }

    var containers = JSON.parse(body);
    doProcess(containers);
});

/**
 * 处理获取到的docker container信息
 * @param containers
 */
function doProcess(containers){
    if(util.isSame(containers, lastContainers)) return;

    lastContainers = containers;
    logic.refresh(containers);
}



