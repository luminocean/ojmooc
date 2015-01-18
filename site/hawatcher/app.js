var request = require('request');
var Q = require('q');
var util = require('./util/util');
var controller = require('./core/proxy_controller');
var config = require('./config/config');

//上次获取的容器列表
var lastContainers = [];
Q.longStackSupport = true;

//开始周期性地检查docker容器变化
inspectContainers();
setInterval(inspectContainers, 5000);

/*
 * 检查docker内配置的容器是否有变化，如果有变化则刷新HAProxy的负载配置
 */
function inspectContainers(){
    var promises = [];
    for(var i=0; i<config.inspectIps.length; i++){
        var ip = config.inspectIps[i];
        var path = config.restful.path;
        var port = config.restful.port;

        var url = 'http://'+ip+':'+port+path;
        promises.push(Q.denodeify(doInspect)(url,ip));
    }

    Q.all(promises).then(function(containerGroups){
        var containers = [];
        for(var i=0; i<containerGroups.length; i++){
            var containerGroup = containerGroups[i];
            for(var j=0; j<containerGroup.length; j++){
                var container = containerGroup[j];
                containers.push(container);
            }
        }

        processContainerChanges(containers);
    },function(err){
        console.error(err.stack);
    });
}

function doInspect(url,ip,callback){
    //准备请求的数据
    var requestObj = {
        "url":url,
        "method":"GET"
    };
    //发送执行请求，获取执行结果
    request(requestObj,function(err, response, body){
        if(err) return callback(err);

        //从所有containers里面找出ojrunner的containers进行处理
        var allContainers = JSON.parse(body);
        var containers = [];
        for(var i=0; i<allContainers.length; i++){
            var container = allContainers[i];
            if(container.Ports[0]
                && (container.Ports[0].PrivatePort === config.privatePort)){
                container.ip = ip;
                containers.push(container);
            }
        }

        callback(null, containers);
    });
}

/**
 * 处理Docker容器变化，如果有变化则刷新HAProxy配置信息
 * @param containers
 */
function processContainerChanges(containers){
    //如果取到的信息和上一次一样则直接跳过
    if(util.isSame(containers, lastContainers)) return;

    console.log('docker列表发生变化，准备刷新HAProxy配置');
    //否则根据新取到的容器信息刷新HAProxy
    lastContainers = containers;
    controller.refresh(containers);
}



