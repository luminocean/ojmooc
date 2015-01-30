var parser = {};
module.exports = parser;

var parseConfig = {
    //对外提供的parser方法
    "parseStopPoint":{
        //示例
        //返回的结果的一个属性,表示某一行输出的分析
        /*"function":{
            //分析用的正则
            "reg": /~"(\d+),\s(.*)\s\((.*)\)\sat\s(.*):(\d+)/,
            //每一项表示对应的分组名称，顺序也对应，一行分析出来的各种子属性
            "meta":["funcLineNum","funcName","params","srcName","srcLineNum"]
        },*/
        "code":{
            "reg": /~"(\d+)(?:\\t)+(.*)\\n/,
            "meta":["lineNum","text"]
        }
    },
    "parsePrintVal":{
        "value":{
            "reg":/~"\$\d+\s=\s(.+)"/,
            "meta":["value"]
        }
    },
    "parseExit":{
        "normalExit":{
            "reg":/\(process\s(\d+)\)\sexited normally/,
            "meta":["processId"]
        }
    }
};

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
        }
    })(func);
}