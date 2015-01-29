var dbr = require('./debugger');

var controller = {};
module.exports = controller;

//各种操作请求中包含的参数名称配置
var paramConfigs = {
    //执行套装的参数
    "suit":["programName","breakLines"],
    "debug":["programName"],
    "breakPoint":["debugId","breakLines"],
    "run":["debugId"],
    "continue":["debugId"],
    "stepInto":["debugId"],
    "stepOver":["debugId"],
    "printVal":["debugId","valName"]
};

/**
 * 根据传入的请求对象找到对应的逻辑处理函数进行执行
 * @param json 客户端传入的请求数据
 * @param callback
 */
controller.process = function(json, callback){
    //debugger对象中提供的所有接口遍历一遍
    for(var key in dbr){
        if(!dbr.hasOwnProperty(key))
            continue;

        //如果在传入的json参数中有这种接口则进入处理
        if(json[key]){
            //取出客户端传来的参数
            var inputParams = json[key];
            //取出这种请求应该带有的参数名称
            var params = paramConfigs[key];
            //将所有的参数值存起来
            var paramValues = [];
            params.forEach(function(param){
                paramValues.push(inputParams[param]);
            });
            //回调函数放在最后
            paramValues.push(function(err,result){
                return callback(err,result);
            });
            //使用apply传入所有参数，调用debugger处理
            dbr[key].apply(null,paramValues);
        }
    }
};

