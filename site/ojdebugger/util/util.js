var moment = require('moment');

/**
 * 将一个对象的属性扩展给另一个对象
 * @param obj1 被扩展的对象
 * @param obj2 提供扩展内容的对象
 */
exports.extend = function(obj1,obj2){
    for(var key in obj2){
        if(!obj2.hasOwnProperty(key) || obj1[key])
            continue;

        obj1[key] = obj2[key];
    }
};

/**
 * 根据当前时间自动生成debugId
 * @returns {*}
 */
exports.genDebugId = function(){
    return moment().format('YYYYMMDDx');
};