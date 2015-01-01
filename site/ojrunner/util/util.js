var moment = require('moment');
var fs = require('fs');

//可用的扩展名
var extNames = ['','cpp'];

exports.generateFileName = function(){
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