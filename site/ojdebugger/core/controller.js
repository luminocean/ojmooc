/**
 * 用于将用户请求的json对象分配给具体的debugger对象方法处理
 */
var dbr = require('./debugger');
//debugger方法配置
var methods = require('../config/config').methods;

var controller = {};
module.exports = controller;

/**
 * 根据传入的请求对象找到对应的逻辑处理函数进行执行
 * @param requestData 客户端传入的请求数据
 * @param callback
 */
controller.dispatch = function(requestData, callback){
    //由请求中解析而来的操作请求名称
    var methodName = requestData.methodName;
    //该操作请求附带的数据
    var data = requestData.body;

    //如果在方法配置中有该方法
    if(!methods[methodName]) {
        return callback(new Error('未知的请求方法，在配置中找不到:'+methodName));
    }

    //将所有的参数值从请求中一个个取出后存起来，将会作为入参传给debugger
    var paramValues = [];
    for(var attr in data){
        if(!data.hasOwnProperty(attr)) continue;

        paramValues.push(data[attr]);
    }

    //回调函数放在入参列表的最后
    paramValues.push(function(err,result){
        return callback(err,result);
    });

    //使用apply传入所有参数，调用debugger处理
    return dbr[methodName].apply(null,paramValues);
};

