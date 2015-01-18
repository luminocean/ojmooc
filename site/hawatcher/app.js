var request = require('request');
var Q = require('q');
var util = require('./util/util');
var controller = require('./core/proxy_controller');
var config = require('./config/config');

//上次获取的容器列表
var lastContainers = [];
//开启Q的debug模式
Q.longStackSupport = true;

//开始周期性地检查docker容器变化
inspectContainers();
setInterval(inspectContainers, 5000);

/*
 * 检查docker内配置的容器是否有变化，如果有变化则刷新HAProxy的负载配置
 */
function inspectContainers(){
    //将异步的检查动作promise化，所有的docker宿主机的容器列表都取得后统一处理
    var promises = [];
    for(var i=0; i<config.inspectIps.length; i++){
        var ip = config.inspectIps[i];
        var path = config.restful.path;
        var port = config.restful.port;

        var url = 'http://'+ip+':'+port+path;
        promises.push(Q.denodeify(getContainersOnHost)(url,ip)) ;
    }

    //所有的promise都完成，即已经访问了所有配置的docker宿主机了
    Q.allSettled(promises).then(function(results){
        //每台docker宿主机上配置的docker列表的集合
        var containerGroups = [];

        //获取每一个promise的结果，如果是fulfilled表示获取成功
        //将获取的容器组（某一个host上的容器）加入数组中
        results.forEach(function (result) {
            if (result.state === "fulfilled") {
                containerGroups.push(result.value);
            } else {
                console.error(result.reason.stack);
            }
        });

        //所有宿主机上配置的docker容器集合
        //仅仅是将containerGroups里面的元素展开而已
        var containers = [];
        for(var i=0; i<containerGroups.length; i++){
            var containerGroup = containerGroups[i];
            for(var j=0; j<containerGroup.length; j++){
                var container = containerGroup[j];
                containers.push(container);
            }
        }

        validateContainers(containers,function(err,survivors){
            //console.log('共检测到容器数：'+containers.length+' 存活容器数:'+survivors.length);
            processContainerChanges(survivors);
        });
    });
}

/**
 * 向docker容器发送心跳检测看看是不是还活着，如果死掉了就把该容器从列表中删除
 * @param containers 需要检查的容器列表
 * @param callback
 */
function validateContainers(containers,callback){
    //还存活着的容器，将会作为callback的参数返回
    var survivors = [];
    //计数已经检查了几个容器了，全部检查完以后才调用callback
    var counter = 0;

    for(var i=0; i<containers.length; i++){
        var container = containers[i];
        var ip = container.ip;

        if( !container.Ports || !container.Ports[0]
                || !container.Ports[0].PublicPort){
            console.error('获得的容器信息中缺少public端口信息：'+JSON.stringify(container));
            continue;
        }
        var publicPort = container.Ports[0].PublicPort;
        var url = "http://"+ip+':'+publicPort;

        //准备请求的数据
        var requestObj = {
            //这里直接访问HAProxy做负载均衡
            "url":url,
            "method":"POST",
            "json":true,
            "timeout":5000,
            "body":{
                "heartBeat":"Are you alive?"
            }
        };

        (function(requestObj,container){
            //发送执行请求，获取执行结果
            request(requestObj,function(err, response, body){
                if(err)
                    return console.error(err.stack);
                counter++;

                if(body.isAlive)
                    survivors.push(container);

                if(counter===containers.length){
                    callback(null,survivors);
                }
            });
        })(requestObj,container);
    }
}

/**
 * 根据指定url获取该地址上docker服务所管理的容器列表
 * @param url 要访问的docker宿主地址
 * @param ip url里面的ip部分，为了免去解析就直接传进来了，用来标识某个容器在哪台主机上
 * @param callback 回调函数
 */
function getContainersOnHost(url,ip,callback){
    //准备请求的数据
    var requestObj = {
        "url":url,
        "method":"GET",
        "timeout":5000
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