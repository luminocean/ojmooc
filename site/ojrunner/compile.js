var cp = require('child_process');

//执行编译任务的shell文件的位置
var compileShell = "./shell/compile.sh";
/**
 * 编译方法
 * @param srcPath 需要编译的已存在的源文件的路径
 * @param buildPath 将要生成的可执行文件的路径
 * @param callback 完成后的回调函数
 */
exports.compile = function(srcPath, buildPath, callback){
    cp.execFile(compileShell,[srcPath,buildPath],function(err){
       if(err){
           return callback(err, null);
       }

       callback();
    });
};