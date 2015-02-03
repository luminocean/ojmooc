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
                var meta = attr.meta;

                console.log(reg);

                //遍历要解析的数据的每一行
                lines.forEach(function(line){
                    var regResults = line.match(reg);
                    if(!regResults) return;

                    object = object || {};
                    object[key] = {};
                    for(var i=0; i<meta.length; i++){
                        object[key][meta[i]] = regResults[i+1];
                    }
                });
            }
            return object;
        };
    })(func);
}