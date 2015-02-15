var config = {
    //监控docker的时间间隔
    "timeInterval":5000,
    //监控的主机地址，这里可以填写一系列的ip地址从而监控多个docker宿主机
    "inspectIps":[
        "127.0.0.1"
    ],
    "runtime":{
        "dir":"/runtime",
        "config":"*.cfg",
        "pid":"*.pid"
    },
    //对于docker的配置
    //docker的restful api参数，和inpectIps里面的ip地址组合起来就是完整的docker api地址
    "restful":{
        "path":"/containers/json",
        "port":4243
    },
    //两种监视模式的识别配置，用于解析从docker返回的容器信息
    //为了过滤出属于当前运行模式下的容器
    //防止要监控runner结果监控起debugger来了，这样请求会发错地方
    "modes":{
        //ojrunner模式的配置
        "runner":{
            //识别的字段
            "field":"Command",
            //识别的关键字
            "keyword":"ojrunner"
        },
        "debugger":{
            "field":"Command",
            "keyword":"ojdebugger"
        }
    }
};

module.exports = config;