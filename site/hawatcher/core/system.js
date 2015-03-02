/**
 * HAWatcher在系统层的模块，用于和文件系统以及shell交互
 */
var path = require('path');
var cp =require('child_process');
var config = require('../config/config');
var util = require('../util/util');

var refreshShellPath = path.join(__dirname,'../','/shell/refresh.sh');
var reloadShellPath = path.join(__dirname,'../','/shell/reload.sh');
var templateConfigFilePath = path.join(__dirname,'../','/config/haproxy.cfg');

//准备运行期文件目录及文件名
var fileName = util.generateFileName();
var runtimeConfig = config.runtime;
var runtimePath = path.join(__dirname,'../', runtimeConfig.dir);
//拼接出运行期文件路径
var configFilePath = path.join(runtimePath,runtimeConfig.config.replace(/\*/,fileName));
var pidFilePath = path.join(runtimePath,runtimeConfig.pid.replace(/\*/,fileName));

exports.write = function(entries,callback){
    var configText = format(entries);
    //开启shell执行子进程，将输入数据通过stdin输入
    var child = cp.execFile(refreshShellPath, [templateConfigFilePath,configFilePath,config.port],
        function(err,stdout,stderr){
            if(err) return callback(err);
            if(stderr) return console.warn(stderr);

            callback(null);
    });
    child.stdin.end(configText);
};

/**
 * 重新加载HAProxy配置文件完成HAProxy的重启
 */
exports.reload = function(){
    cp.execFile(reloadShellPath,[configFilePath,pidFilePath],function(err, stdout, stderr){
        if(err) return console.error(err);
        if(stderr) return console.warn(stderr);

        console.log('HAProxy重加载完毕');
    });
};

var stopped = false;
//清理运行时数据,在进程退出时候调用
//注意这里使用的函数一定要是同步的调用，如果使用异步调用等不到回调进程就结束了，没有意义
exports.cleanupRuntime = function(){
    if(!stopped){
        //关掉Haproxy进程
        util.killProcess(pidFilePath);
        //删除运行期文件
        util.deleteFile([configFilePath,pidFilePath]);
        stopped = true;
    }
};

/**
 * 将entry格式化成HAProxy识别的配置格式
 * @param entries
 */
function format(entries){
    var configText = '';
    for(var i=0; i<entries.length; i++){
        var entry = entries[i];
        var setCookieStr = entry.isSticky?' check cookie '+entry.server:'';

        configText+='    server '+entry.server+' '+entry.ip+':'
            +entry.port + setCookieStr + '\\n';
    }

    return configText;
}