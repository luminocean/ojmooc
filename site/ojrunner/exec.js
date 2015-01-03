var cp = require('child_process');
var util = require('./util/util.js');

//执行编译任务的shell文件的位置
var execShell = __dirname +"/shell/exec.sh";

/**
 * 执行程序，取得输出结果
 * @param programName 可执行程序的全路径
 * @param inputData 入参数据
 * @param callback 完成后的回调函数
 */
exports.exec = function(programName, inputData, callback){
    //开启shell执行子进程，将输入数据通过stdin输入
    var child = cp.spawn(execShell, [programName]);
    child.stdin.end(inputData);

    //收集子进程返回的数据
    //小心中文在数据拼接时乱码的问题
    var result = "";
    child.stdout.on('data',function(data){
        result += data;
    });

    var errMsg = "";
    child.stderr.on('data',function(data){
        errMsg += data;
    });

    child.on('error', function(err){
       callback(err, null);
    });

    //当子进程退出时，回传执行结果
    child.on('exit',function(){
        if(errMsg)
            return callback(null, errMsg, null);

        //读取运行数据
        util.readReportParams(programName, function(err, params){
            if(err) return callback(err, null, null);

            callback(null, result, params);
        })
    });
};