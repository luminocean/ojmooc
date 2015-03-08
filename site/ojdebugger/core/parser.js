var util = require('../util/util');
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
                //需要手动构建的属性直接跳过
                if(aspect.auto === false)
                    continue;

                var reg = aspect.reg;
                var attrNames = aspect.attrNames;
                var finish = aspect.finish;
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

                    if(finish && object) object.finish = true;
                    if(info && object) object.info = true;
                });

                //一旦某一个属性有结果了，就不再循环其他的属性了
                if(object) break;
            }

            return object;
        };
    })(methodName);
}

//以下为特殊的定制解析方法
/**
 * 局部变量解析
 * @param batch
 * @returns {{}}
 */
parser.parseLocals = util.mergeMethod(parser,'parseLocals',function(batch){
    //要返回的对象
    var object = null;

    //要解析的文本
    var resolveText = getResolveText(batch);
    //把合起来的大文本按照各个local变量切分开
    var localTexts = resolveText.split(/\\n/).filter(function(element){
        //剔除空行
        if(element) return true;
    });

    var locals = null;
    localTexts.forEach(function(localText){
        var localTextMatches = localText.match(/(.*?)\s=\s(.*)/);
        if(localTextMatches){
            //如果匹配到了，locals才不再是null
            if(!locals) locals = locals || {};
            locals[localTextMatches[1]] = localTextMatches[2];
        }
    });

    if(locals){
        object = object || {};
        object.locals = locals;
    }

    //返回的object可能是null，也可能包含locals属性
    return object;
});

parser.parsePrintVal = util.mergeMethod(parser,'parsePrintVal',function(batch){
    //要返回的对象
    var object = null;

    var resolveText = getResolveText(batch);
    //把合起来的大文本按照各个local变量切分开
    var valueText = resolveText.replace(/\\n/,'');

    var varObj = null;
    //分解键值对
    var localTextMatches = valueText.match(/(.*?)\s=\s(.*)/);
    if(localTextMatches){
        if(!varObj) varObj = varObj || {};

        varObj.id = localTextMatches[1];
        varObj.value = localTextMatches[2];
    }

    if(varObj){
        object = object || {};
        object.var = varObj;
    }

    //返回的object可能是null，也可能包含var属性
    return object;
});

/**
 * 把一段batch文本里面所有的~" "之间的内容取出来合并到一起,并把\"还原为"
 * 起到还原gdb输出的效果
 * @param batch
 * @returns {string}
 */
function getResolveText(batch){
    //截取处要处理的部分
    var resolveArea = batch.match(/(~[\S\s]*)\^done/)[1];

    //把每行外面包的~" "去掉后拼在一起
    var resolveText = "";
    var areaLines = resolveArea.split(/\n/);
    areaLines.forEach(function(line){
        var lineMatches = line.match(/~\"(.*)\"/);
        if(lineMatches)
            resolveText += lineMatches[1];
    });

    return resolveText.replace(/\\"/g,'"');
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