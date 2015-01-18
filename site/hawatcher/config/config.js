var config = {
    //监控docker的时间间隔
    "timeInterval":5000,
    //监控的主机地址，这里可以填写一系列的ip地址从而监控多个docker宿主机
    "inspectIps":[
        "127.0.0.1"
    ],
    //docker的restful api参数
    //和inpectIps里面的ip地址组合起来就是完整的docker api地址
    "restful":{
        "path":"/containers/json",
        "port":4243
    },
    //后台docker服务器的私有端口,用于识别是不是ojrunner服务器的参数
    "privatePort":23333
};

module.exports = config;