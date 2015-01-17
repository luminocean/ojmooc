var config = {
    //docker的监控配置
    "docker":{
        //监控docker的时间间隔
        "timeInterval":5000,
        //docker的restful接口
        "url":"http://localhost:4243/containers/json"
    }
};

module.exports = config;