var cp = require('child_process');
var util = require('../util/util.js');
var config = require('../config/config.js');

//执行编译任务的shell文件的位置
var execShell = util.absPath(config.shell.exec);
//编译完的可执行文件的文件系统路径(因为要传给shell由shell来使用)
var buildPath = util.absPath(config.repo.dir.build);
//报告文件的文件系统路径
var reportPath = util.absPath(config.repo.dir.report);
//shell文件的路径，因为docker需要用到一个shell
var shellPath = util.absPath(config.shell.base);

/**
 * 执行程序，取得输出结果
 * @param programName 可执行程序的程序名
 * @param inputData 入参数据
 * @param callback 完成后的回调函数
 */
exports.exec = function(programName, inputData, callback){
    //设置执行时间上限
    var options = {"timeout":config.exec.limit.timeout};

    //开启shell执行子进程，将输入数据通过stdin输入
    var child = cp.execFile(execShell,[programName,buildPath,reportPath,shellPath],options,
        function(err,stdout,stderr){
            if(err) return callback(err);
            if(stderr.toString()) return callback(new Error(stderr.toString()));

            //如果没有错误则读取运行报告，返回运行结果
            var result = stdout.toString();
            util.readReportParams(programName, function(err, params){
                if(err) return callback(err);

                callback(null, result, params);
            });
    });
    child.stdin.end(inputData);
};