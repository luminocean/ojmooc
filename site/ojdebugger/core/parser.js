var parseConfig = require('../config/config').parseConfig;

//要导出的parser对象
var parser = {};
module.exports = parser;

//根据配置自动构建parser对外接口
for(var func in parseConfig){
    if(!parseConfig.hasOwnProperty(func)) continue;

    (function(func){
        //给parser对象添加一个接口
        parser[func] = function(text){
            var lines = text.split('\n');
            var object = null;

            var funcConfig = parseConfig[func];
            //遍历每一类属性
            for(var key in funcConfig){
                if(!funcConfig.hasOwnProperty(key)) continue;
                //取出该类的正则以及子属性名称列表
                var attr = funcConfig[key];
                var reg = attr.reg;
                var metas = attr.meta;
                var exit = attr.exit;
                var info = attr.info;

                //遍历要解析的数据的每一行
                lines.forEach(function(line){
                    var regResults = line.match(reg);
                    if(!regResults) return;

                    object = object || {};
                    object[key] = object[key] || {};
                    for(var i=0; i<metas.length; i++){
                        addValue(object[key],metas[i],regResults[i+1]);
                    }
                });
            }

            if(exit && object)
                object.exit = true;
            if(info && object)
                object.info = true;

            return object;
        };
    })(func);
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