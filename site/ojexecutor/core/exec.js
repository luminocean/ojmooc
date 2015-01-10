var path = require('path');
var cp = require('child_process');
var util = require('../util/util');
var config = require('../config/config');

//可执行文件所在的位置
var buildPath = path.join(__dirname,'../',config.repo.dir.build);
//报告文件所在位置
var reportPath = path.join(__dirname,'../',config.repo.dir.report);
//执行用shell的位置
var execShellPath = path.join(__dirname,'../',config.shell.exec);

/**
 * 根据给定的程序名找到对应的编译后的程序，传入输入数据执行，返回结果
 * @param programName
 * @param inputData
 * @param callback
 */
exports.exec = function(programName, inputData, callback){
    //开启shell执行子进程，将输入数据通过stdin输入
    var child = cp.spawn(execShellPath, [programName,buildPath,reportPath]);
    child.stdin.end(inputData);

    //收集子进程返回的数据
    //小心中文在数据拼接时乱码的问题
    var result = "";
    var errMsg = "";
    child.stdout.on('data',function(data){
        result += data;
    });
    child.stderr.on('data',function(data){
        errMsg += data;
    });

    //当子进程退出时，回传执行结果
    child.on('exit',function(){
        if(errMsg)
            return callback(new Error(errMsg));

        //读取运行数据
        util.readReportParams(programName, function(err, params){
            if(err) return callback(err);

            callback(null, result, params);
        });
    });
};