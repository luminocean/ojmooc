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
    var body = requestData.body;

    //如果在方法配置中有该方法
    if(!methods[methodName]) {
        return callback(new Error('未知的请求方法:'+methodName));
    }

    //取出该方法需要的入参名称
    var configParams = methods[methodName].paramNames;
    //将所有的参数值从请求中取出后存起来，将会作为入参传给debugger
    var paramValues = [];
    configParams.forEach(function(param){
        var requestParam = body[param];
        if(!requestParam)
            return callback(new Error('配置中需要的属性在请求中找不到：'+param));
        paramValues.push(requestParam);
    });
    //回调函数放在入参列表的最后
    paramValues.push(function(err,result){
        return callback(err,result);
    });
    //使用apply传入所有参数，调用debugger处理
    return dbr[methodName].apply(null,paramValues);
};

