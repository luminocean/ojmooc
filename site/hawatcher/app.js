var request = require('request');
var util = require('./util');
var controller = require('./proxy_controller');

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

    //获取docker信息的json对象做处理
    var containers = JSON.parse(body);
    doProcess(containers);
});

/**
 * 处理获取到的docker容器信息
 * @param containers
 */
function doProcess(containers){
    //如果取到的信息和上一次一样则直接跳过
    if(util.isSame(containers, lastContainers)){
        console.log('container列表没有变化');
        return;
    }

    //否则根据新取到的容器信息刷新HAProxy
    lastContainers = containers;
    controller.refresh(containers);
}



