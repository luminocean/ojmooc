var fs = require('fs');
var path = require('path');
var moment = require('moment');
var config = require('../config/config').settings;

//可用的扩展名
var extNames = config.repo.cleanExt;
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

/**
 * 清理中间文件
 * @param fileName 中间文件的文件名（扩展名前面的部分）
 * @param dirs 查找的目录
 */
exports.cleanup = function(fileName, dirs){
    for(var i=0; i<dirs.length; i++){
        var path = dirs[i]+"/"+fileName;
        for(var j=0; j<extNames.length; j++){
            var extName = extNames[j];
            if(extName)
                deleteFile(path+"."+extName);
            else
                deleteFile(path);
        }
    }
};

/**
 * 准备临时文件存放需要的目录，避免找不到目录而出错
 * 注意本方法调用了同步方法，请不要反复执行，会产生性能问题
 */
exports.prepareDir = function(){
    //如果repo目录本身就不存在就先创建
    if(!fs.existsSync(path.join(__dirname,'../',config.repo.dir.base))){
        fs.mkdirSync(path.join(__dirname,'../',config.repo.dir.base));
    }

    //获取各临时目录
    var dirs = config.repo.dir;
    for(var key in dirs){
        //跳过继承属性
        if( !dirs.hasOwnProperty(key) ) continue;

        var dir = path.join(__dirname,'../',dirs[key]);
        if( !fs.existsSync(dir) ){
            fs.mkdirSync(dir);
        }
    }
};

/**
 * 删除文件
 * @param path 要删除的文件的路径，如src_repo/aa.cpp
 */
function deleteFile(path){
    fs.exists(path, function(exists){
        if(exists){
            fs.unlink(path, function(err){
                if(err) {
                    console.log(err);
                }
            });
        }
    });
}