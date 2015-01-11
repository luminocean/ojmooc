var path = require('path');
var cp = require('child_process');
var util = require('../util/util.js');
var config = require('../config/config.js');

//执行编译任务的shell文件的位置
var execShell = path.join(__dirname,'../',config.shell.exec);
//编译完的可执行文件的文件系统路径(因为要传给shell由shell来使用)
var buildPath = path.join(__dirname,'../',config.repo.dir.build);
//报告文件的文件系统路径
var reportPath = path.join(__dirname,'../',config.repo.dir.report);
//shell文件的路径，因为docker需要用到一个shell
var shellPath = path.join(__dirname,'../',config.shell.base);

/**
 * 执行程序，取得输出结果
 * @param programName 可执行程序的程序名
 * @param inputData 入参数据
 * @param callback 完成后的回调函数
 */
exports.exec = function(programName, inputData, callback){
    //开启shell执行子进程，将输入数据通过stdin输入
    var child = cp.spawn(execShell, [programName,buildPath,reportPath,shellPath]);
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