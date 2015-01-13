var system = require('./system');

/**
 * 根据传入的容器列表刷新HAProxy配置
 * @param containers
 */
exports.refresh = function(containers){
    var entries = convertToEntries(containers);
    system.write(entries);
    system.reload();
};

function convertToEntries(containers){
    var entries = [];
    for(var i=0; i<containers.length; i++){
        var container = containers[i];
        var entry = convert(container);
        entries.push(entry);
    }
    return entries;
}

function convert(container){
    var entry = {};
    entry.server = container.Names.toString().replace('/','');
    entry.ip = "127.0.0.1";
    entry.port = container.Ports[0].PublicPort;
    return entry;
}