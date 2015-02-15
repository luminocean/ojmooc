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
    var child = cp.execFile(refreshShellPath, [templateConfigFilePath,configFilePath],
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

//清理运行时数据
//由于这是在进程退出时执行的，所以必须要使用同步的文件操作，否则
exports.cleanupRuntime = function(){
    util.deleteFile([configFilePath,pidFilePath]);
};

/**
 * 将entry格式化成HAProxy识别的配置格式
 * @param entries
 */
function format(entries){
    var configText = '';
    for(var i=0; i<entries.length; i++){
        var entry = entries[i];
        configText+='    server '+entry.server+' '+entry.ip+':'
            +entry.port+' check cookie '+entry.server+'\\n';
    }

    return configText;
}