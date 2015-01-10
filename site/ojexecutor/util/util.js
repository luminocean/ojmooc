var fs = require('fs');
var path = require('path');
var config = require('../config/config.js');

//可用的扩展名
var extNames = config.repo.cleanExt;
//报告文件所在位置
var reportPath = path.join(__dirname,'../',config.repo.dir.report);

/**
 * 解析shell内置time命令返回的文件内容，解析出各个时间，以秒的形式返回
 * @param programName 被生成执行报告的程序名
 * @param callback 返回解析结果的回调函数
 */
exports.readReportParams = function(programName, callback){
    fs.readFile(path.join(reportPath,programName+".txt"), function(err, data){
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

function convertToSeconds(timeStr){
    if(!timeStr) return;

    var pieces = timeStr.match(/([0-9]*)m([0-9.]*)s/);
    if(pieces.length != 3) return;

    var min = parseFloat(pieces[1]);
    var sec = parseFloat(pieces[2]);
    return min*60+sec;
}