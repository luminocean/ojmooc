var moment = require('moment');
var fs = require('fs');
var path = require('path');
var config = require('../config/config.js');

//可用的扩展名
var extNames = config.repo.cleanExt;
var reportRepo = absPath(config.repo.dir.report);

//项目的根目录，作为所有其它相对路径拼接的基准目录
var basePath = path.join(__dirname,'..');

/**
 * 根据当前时间生成唯一文件名
 */
exports.generateFileName = function(){
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
 * 解析shell内置time命令返回的文件内容，解析出各个时间，以秒的形式返回
 * @param programName 被生成执行报告的程序名
 * @param callback 返回解析结果的回调函数
 */
exports.readReportParams = function(programName, callback){
    fs.readFile(reportRepo+"/"+programName+".txt", function(err, data){
        if(err) return callback(err, null);

        var params = {};
        var report = data.toString();
        var lines = report.split("\n");

        for(var i=0; i<lines.length; i++){
            var line = lines[i];
            if(line){
                var parts = line.split(" ");
                if( parts.length == 2 ){
                    //设置key/value对
                    //前三行是时间，做转换
                    if( i<3 )
                        params[parts[0]] = convertToSeconds(parts[1]);
                    else
                        //后面的就直接赋值
                        params[parts[0]] = parts[1];
                }
            }
        }

        callback(null, params);
    });
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

function convertToSeconds(timeStr){
    if(!timeStr) return;

    var pieces = timeStr.match(/([0-9]*)m([0-9.]*)s/);
    if(pieces.length != 3) return;

    var min = parseFloat(pieces[1]);
    var sec = parseFloat(pieces[2]);
    return min*60+sec;
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
                    console.log(err);
                }
            });
        }
    });
}