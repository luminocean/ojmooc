var fs = require('fs');
var path = require('path');
var moment = require('moment');
var config = require('../config/config').settings;

//可用的扩展名
var extNames = config.repo.cleanExt;
//项目的根目录，作为所有其它相对路径拼接的基准目录
var basePath = path.join(__dirname,'..');

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
 * 合并一个对象的两个方法。
 * ->如果object包含methodName方法，且返回值可转换为false
 * 则调用newMethod，返回newMethod的返回值
 * ->如果object包含methodName方法，且返回值可转换为true
 * 则直接返回结果，不调用newMethod
 * ->如果object不含methodName方法，则将newMethod作为object的methodName方法
 * @param object
 * @param methodName
 * @param newMethod
 * @returns {Function}
 */
exports.mergeMethod = function(object,methodName,newMethod){
    //如果没有这个方法，直接添加
    if(!object[methodName]){
        object[methodName] = newMethod;
        return;
    }

    //原来的方法
    var originMethod = object[methodName];

    return function(){
        var originReturn = originMethod.apply(object,arguments);
        //如果原来的方法有正常的返回值就直接返回
        if(originReturn)
            return originReturn;
        //否则调用新方法
        else
            return newMethod.apply(object,arguments);
    };
};

/**
 * 根据当前时间自动生成debugId
 * @returns {*}
 */
exports.genDebugId = function(){
    return moment().format('YYYYMMDDx');
};

exports.absPath = absPath;

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
    if(!fs.existsSync(absPath(config.repo.dir.base))){
        mkdirsSync(absPath(config.repo.dir.base));
    }

    //获取各临时目录
    var dirs = config.repo.dir;
    for(var key in dirs){
        //跳过继承属性
        if( !dirs.hasOwnProperty(key) ) continue;

        var dir = absPath(dirs[key]);
        if( !fs.existsSync(dir) ){
            fs.mkdirSync(dir);
        }
    }
};

/**
 * 获取一个路径的绝对路径
 * 如果传入的就是绝对路径则直接返回
 * 如果传入相对路径则以项目根目录为基准返回处理后的绝对路径
 */
function absPath(inputPath){
    //绝对路径
    if(inputPath.substring(0,1) == '/'){
        return inputPath;
    }else{
        return path.join(basePath,inputPath);
    }
}

/**
 * 创建目录，如果父目录不存在则自动创建父目录
 * @param dirpath
 */
function mkdirsSync(dirpath) {
    if(!fs.existsSync(dirpath)){
        mkdirsSync(path.dirname(dirpath));
        fs.mkdirSync(dirpath);
    }
}

/**
 * 删除文件
 * @param path 要删除的文件的路径，如src_repo/aa.cpp
 */
function deleteFile(path){
    fs.exists(path, function(exists){
        if(exists){
            fs.unlink(path, function(err){
                if(err) {
                    console.error(err);
                }
            });
        }
    });
}