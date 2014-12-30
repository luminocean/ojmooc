var cp = require('child_process');

//执行编译任务的shell文件的位置
var compileShell = __dirname +"/shell/compile.sh";
/**
 * 编译方法
 * @param srcFullPath 需要编译的已存在的源文件的全路径
 * @param buildFullPath 将要生成的可执行文件的全路径
 * @param callback 完成后的回调函数
 */
exports.compile = function(srcFullPath, buildFullPath, callback){
    cp.execFile('./shell/compile.sh',[srcFullPath,buildFullPath],function(err, stdout, stderr){
       if(err){
           console.log('ERROR::'+err);
           return;
       }

       callback();
    });
}