var moment = require('moment');
var fs = require('fs');
var path = require('path');

//可用的扩展名
var extNames = ['','cpp',"txt"];
var reportRepo = path.join(__dirname, "../report_repo");

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
                    var key = parts[0];
                    var value = convertToSeconds(parts[1]);
                    params[key] = value;
                }
            }
        }

        callback(null, params);
    });
};

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