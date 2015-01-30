/**
 * 用于将用户请求的json对象分配给具体的debugger对象处理
 */
var dbr = require('./debugger');

var controller = {};
module.exports = controller;

//各种操作请求中包含的参数名称配置
//controller会将用户的json请求中对应的这些变量取出传入debugger
//比如请求对象中有一个continue属性，
//那么就会从该对象中取出debugId属性作为参数传给debugger对象的continue方法
var dbrMethodConfig = {
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
 * @param requestJSON 客户端传入的请求数据
 * @param callback
 */
controller.process = function(requestJSON, callback){
    //找出请求json对象中的方法
    for(var methodName in requestJSON){
        if(!requestJSON.hasOwnProperty(methodName))
            continue;

        //如果该方法是debugger直接提供的
        if(dbrMethodConfig[methodName]){
            //取出客户端传来的参数
            var requestParams = requestJSON[methodName];
            //取出这种请求应该带有的参数名称
            var configParams = dbrMethodConfig[methodName];
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
            dbr[methodName].apply(null,paramValues);
        }
    }
};

