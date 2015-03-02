/**
 * HAProxy的控制器，用于刷新HAProxy配置
 */
var system = require('./system');

/**
 * 根据传入的容器列表刷新HAProxy配置
 * @param containers
 */
exports.refresh = function(containers){
    var entries = convertToEntries(containers);
    //将新的配置写入HAProxy配置文件
    system.write(entries,function(err){
        if(!err){
            //重启HAProxy
            system.reload();
        }
    });
};

/**
 * 将从docker直接获取的JSON信息转换成易于读取的配置对象
 * @param containers
 * @returns {Array}
 */
function convertToEntries(containers){
    var entries = [];
    for(var i=0; i<containers.length; i++){
        var container = containers[i];
        var entry = convert(container);
        if(entry){
            entry.isSticky = container.isSticky;
            entries.push(entry);
        }
    }
    return entries;
}

/**
 * 将从docker获取的json对象转换成易于操作的配置对象，其中包含服务器名、ip地址和对外端口
 * @param container
 * @returns {{}}
 */
function convert(container){
    var entry = {};
    //server名会带有前缀的/，HAProxy不允许这样因此将其去除
    entry.server = container.Names.toString().replace('/','');
    entry.ip = container.ip;
    entry.port = container.Ports[0].PublicPort;
    return entry;
}