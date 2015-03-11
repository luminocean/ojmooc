#!/usr/bin/nodejs
var events = require('events');
var domain = require('domain');
var request = require('request');
var Q = require('q');
var commander = require('commander');
var util = require('./util/util');
var controller = require('./core/controller');
var system = require('./core/system');
var config = require('./config/config');

util.prepareDir();
//开启Q的debug模式
Q.longStackSupport = true;

//上次获取的容器列表
var lastContainers = [];

//解析进程参数
var mode = resolveArgs(process.argv);

//同步写入自己的pid,从而可以写脚本去通过写入的pid手动触发hawatcher的检查
system.writeWatcherPid();

//使用domain来捕获异步异常
var d = domain.create();
//异步异常处理
d.on('error',function(err){
    console.error(err);
});

inspect();
//十分钟检查一次
setInterval(inspect, config.inspectTimeInterval);

//手动刷新事件注册
var emitter = new events.EventEmitter();
emitter.on('reinspect',function(){
    console.log('手动刷新docker容器列表');
    inspect();
});

//设定进程事件
process.on('SIGINT',exit);
process.on('SIGTERM',exit);
process.on('exit',exit);
process.on('uncaughtException',function(err){
    console.error(err);
});
//收到信号时出发reinspect事件
process.on('SIGUSR2', function(){
    emitter.emit('reinspect');
});

/**
 * 在domain内运行inspectContainers
 */
function inspect(){
    d.run(function(){
        inspectContainers();
    });
}
/**
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
        //将获取的容器组（某一个host上的容器列表）加入数组中
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

        //进行容器的心跳检查，如果存活则进行容器的变更处理
        validateContainers(containers,function(err,survivors,zombies){
            if(zombies.length > 0){
                //复活死亡的容器(如果有),但不是立即更新负载均衡
                //因为不能保证重启成功了，要等下一次检查
                bringBackToLife(zombies,function(err){
                    if(err) return console.error(err);
                });
                //设定1秒后重新检查
                setTimeout(inspectContainers,1000);
            }else{
                //console.log('共检测到容器数：'+containers.length+' 存活容器数:'+survivors.length);
                processContainerChanges(survivors);
            }
        });

        //processContainerChanges(containers);
    });
}

/**
 * 向docker容器发送心跳检测看看是不是还活着，如果死掉了就把该容器从列表中删除
 * @param containers 需要检查的容器列表
 * @param callback
 */
function validateContainers(containers,callback){
    //还存活着的容器
    var survivors = [];
    //已经卡死的容器
    var zombies = [];

    //计数已经检查了几个容器了，全部检查完以后才调用callback
    var counter = 0;

    //如果为空直接返回，否则不会进入下面的循环而卡死
    if(containers.length == 0){
        return callback(null,survivors);
    }

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

        //这里使用额外使用闭包防止回调函数中使用的外部变量被覆盖
        (function(requestObj,container){
            //发送执行请求，获取执行结果
            request(requestObj,function(err, response, body){
                //发完请求后就把计数器+1，不管成功还是失败
                counter++;

                //如果容器还活着则加入幸存者名单
                if(body && body.isAlive)
                    survivors.push(container);
                else
                    //否则加入僵尸名单，准备将其复活
                    zombies.push(container);

                if(err)
                    console.error(err.stack);

                //所有容器都检查完毕后调用回调函数回传检查后的容器
                if(counter===containers.length){
                    callback(null,survivors,zombies);
                }
            });
        })(requestObj,container);
    }
}

/**
 * 复活容器
 * @param zombies
 * @param callback
 */
function bringBackToLife(zombies,callback){
    //处理的容器计数
    var processedCount = 0;

    zombies.forEach(function(container){
        //给要重启的容器添加模式信息，这样shell脚本才知道要重启哪一种docker容器
        container.mode = mode;
        system.restartContainer(container,function(err){
            processedCount++;
            if(err) return callback(err);
            //全部处理完，回调
            if(processedCount == zombies.length){
                callback();
            }
        });
    });
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

        //从所有containers里面找出当前hawatcher所负责的containers进行处理
        var allContainers = JSON.parse(body);
        var containers = [];
        for(var i=0; i<allContainers.length; i++){
            var container = allContainers[i];
            //如果该容器符合监控的条件，则纳入监控列表
            var keyFiled = container[mode.field];
            if(keyFiled && keyFiled.match(mode.keyword)){
                container.ip = ip;
                containers.push(container);
            }
        }

        callback(null, containers);
    });
}

//var counter= 0;
/**
 * 处理Docker容器变化，如果有变化则刷新HAProxy配置信息
 * @param containers
 */
function processContainerChanges(containers){
    //手动制造异常的临时代码
    /*if(counter==2){
        throw new Error('err!');
    }else{
        counter++;
    }*/

    //如果取到的信息和上一次一样则直接跳过
    if(util.isSame(containers, lastContainers)) return;

    console.log('docker列表发生变化，准备刷新HAProxy配置');

    //设定负载这些containers的时候需不需要设定cookie，从而可以记忆之前负载均衡的服务器
    var isSticky = mode.isSticky || false;
    containers.forEach(function(container){
        container.isSticky = isSticky;
    });

    //否则根据新取到的容器信息刷新HAProxy
    lastContainers = containers;
    controller.refresh(containers);
}

/**
 * 解析进程参数，返回相应配置文件中的模式对象，表示相应的运行参数
 * @param args
 * @returns {*}
 */
function resolveArgs(args){
    //命令行参数的解析配置
    commander
        .option('-p, --port [portNum]',
        'Specify the port which HAProxy(managed by HAWatcher) listens to (8080 by default)')
        .option('-r, --runner', 'Watch OJRunner docker comtainers(defalut)')
        .option('-d, --debugger', 'Watch OJDebugger docker comtainers')
        .parse(args);

    //根据解析到的命令行参数结果设置当前的运行模式
    var mode = null;
    if(commander.runner){
        mode = config.modes.runner;
    }else if(commander.debugger){
        mode = config.modes.debugger;
    }else{
        //默认监视runner
        mode = config.modes.runner;
    }

    //如果指定了端口，则覆盖配置中的端口设置
    if(commander.port){
        config.port = commander.port;
    }

    return mode;
}

/**
 * 进程退出时的处理函数
 * @param msg
 */
function exit(msg){
    system.cleanupRuntime();
    if(msg instanceof Error)
        console.log('Exits with error:'+msg);
    else if(msg)
        console.log('Exits with code:'+msg);

    process.exit(0);
}