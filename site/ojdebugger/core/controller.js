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
 * @param requestJSON 客户端传入的请求数据
 * @param callback
 */
controller.process = function(requestJSON, callback){
    //找出请求json对象中的方法
    for(var methodName in requestJSON){
        if(!requestJSON.hasOwnProperty(methodName))
            continue;

        //如果在方法配置中有该方法
        if(methods[methodName]){
            //取出客户端传来的参数
            var requestParams = requestJSON[methodName];
            //取出该方法需要的入参名称
            var configParams = methods[methodName].paramNames;
            //将所有的参数值从请求中取出后存起来，将会作为入参传给debugger
            var paramValues = [];
            configParams.forEach(function(param){
                var requestParam = requestParams[param];
                if(!requestParam)
                    return callback(new Error(JSON.stringify(requestJSON)+'请求json对象中的属性与服务器中配置的不符'));
                paramValues.push(requestParam);
            });
            //回调函数放在最后
            paramValues.push(function(err,result){
                return callback(err,result);
            });
            //使用apply传入所有参数，调用debugger处理
            return dbr[methodName].apply(null,paramValues);
        }else{
            return callback(new Error('未知的请求方法:'+methodName));
        }
    }
};

