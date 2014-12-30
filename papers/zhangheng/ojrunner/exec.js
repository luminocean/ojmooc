var cp = require('child_process');

//执行编译任务的shell文件的位置
var execShell = __dirname +"/shell/exec.sh";

/**
 * 执行程序，取得输出结果
 * @param buildFullPath 可执行程序的全路径
 * @param inputData 入参数据
 * @param callback 完成后的回调函数
 */
exports.exec = function(buildFullPath, inputData, callback){
    var child = cp.spawn(execShell, [buildFullPath]);
    child.stdin.end(inputData);

    var result = "";
    child.stdout.on('data',function(data){
        result += data;
    });
    child.on('exit',function(){
        console.log('计算结果:'+result);
    });
}