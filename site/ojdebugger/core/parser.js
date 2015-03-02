var parseConfig = require('../config/config').parseConfig;

//要导出的parser对象
var parser = {};
module.exports = parser;

//根据配置自动构建parser对外接口
for(var methodName in parseConfig){
    if(!parseConfig.hasOwnProperty(methodName)) continue;
    //methodName即parser对外提供的解析方法的名字
    (function(methodName){
        //给parser对象添加一个方法
        parser[methodName] = function(text){
            var lines = text.split('\n');
            var object = null;

            //该方法的解析配置
            var methodConfig = parseConfig[methodName];
            //遍历配置内的每一类属性
            for(var aspectName in methodConfig){
                if(!methodConfig.hasOwnProperty(aspectName)) continue;

                //取出该类别的正则、子属性名称列表等信息
                var aspect = methodConfig[aspectName];
                var reg = aspect.reg;
                var attrNames = aspect.attrNames;
                var exit = aspect.exit;
                var info = aspect.info;

                //遍历要解析的数据的每一行
                lines.forEach(function(line){
                    var regResults = line.match(reg);
                    if(!regResults) return;

                    object = object || {};
                    object[aspectName] = object[aspectName] || {};
                    for(var i=0; i<attrNames.length; i++){
                        addValue(object[aspectName],attrNames[i],regResults[i+1]);
                    }
                });
            }

            if(exit && object) object.exit = true;
            if(info && object) object.info = true;

            return object;
        };
    })(methodName);
}

/**
 * 给一个对象的某个属性添加值，如果没有这个属性则新建，如果已经有了就改变为数组继续添加
 * 如果已经是数组则直接添加
 * @param object 要添加属性对象
 * @param attr 属性名称
 * @param value 属性的值，由于是正则解析出来的所以不会是数组
 */
function addValue(object,attr,value){
    //如果还没有属性就设置值
    if(!object[attr]){
        object[attr] = value;
    }
    //如果是数组则添加
    else if( object[attr] instanceof Array ){
        object[attr].push(value);
    }
    //否则就从单个值改为数组,添加新值
    else{
        var oldValue = object[attr];
        object[attr] = [];
        object[attr].push(oldValue);
        object[attr].push(value);
    }
}