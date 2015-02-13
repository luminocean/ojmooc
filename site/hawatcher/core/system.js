/**
 * HAWatcher在系统层的模块，用于和文件系统以及shell交互
 */
var path = require('path');
var cp =require('child_process');

var configFilePath = path.join(__dirname,'../','/config/haproxy.cfg');
var refreshShellPath = path.join(__dirname,'../','/shell/refresh.sh');
var reloadShellPath = path.join(__dirname,'../','/shell/reload.sh');

exports.write = function(entries){
    var configText = format(entries);

    //开启shell执行子进程，将输入数据通过stdin输入
    //这里需要向shell传送文本，所以使用spawn从而可以使用stdin
    var child = cp.execFile(refreshShellPath,[configFilePath],function(err,stdout,stderr){
        if(err) return console.error(err);
        if(stderr) return console.warn(stderr);
    });
    child.stdin.end(configText);
};

/**
 * 重新加载HAProxy配置文件完成HAProxy的重启
 */
exports.reload = function(){
    cp.execFile(reloadShellPath,[configFilePath],function(err, stdout, stderr){
        if(err) return console.error(err);
        if(stderr) return console.warn(stderr);

        console.log('HAProxy重加载完毕');
    });
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