var parser = {};
module.exports = parser;

var parseConfig = {
    //对外提供的parser方法
    "printVal":{
        //返回的结果的一个属性,表示某一类结果
        "value":{
            //分析用的正则
            "reg":/~"\$\d+\s=\s(.+)"/,
            //每一项表示对应的分组名称，顺序也对应，作为一类结果的各种子属性
            "meta":["value"]
        }
    },
    "debug":{
        "function":{
            "reg": /.*/,
            "meta":["funcLineNum","funcName","srcName","srcLineNum"]
        }
    }
};

//根据配置自动构建parser对外接口
for(var func in parseConfig){
    if(!parseConfig.hasOwnProperty(func)) continue;

    (function(func){
        parser[func] = function(text){
            var lines = text.split('\n');
            var object = {};

            var funcConfig = parseConfig[func];
            //遍历每一个属性
            for(var key in funcConfig){
                if(!funcConfig.hasOwnProperty(key)) continue;

                var attr = funcConfig[key];
                var reg = attr.reg;
                var meta = attr.meta;

                //遍历要解析的数据的每一行
                lines.forEach(function(line){
                    var regResults = line.match(reg);
                    if(!regResults) return;

                    object[key] = {};
                    for(var i=0; i<meta.length; i++){
                        object[key][meta[i]] = regResults[i+1];
                    }
                });
            }

            return object;
        }
    })(func);
}