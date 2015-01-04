var cp = require('child_process');
var config = require('./config/config.json');

//执行编译任务的shell文件的位置
var compileShell = "./shell/compile.sh";
/**
 * 执行编译的方法
 * @param srcType 源码类型
 * @param srcPath 需要编译的已存在的源文件的路径
 * @param buildPath 将要生成的可执行文件的路径
 * @param callback 完成后的回调函数
 */
exports.compile = function(srcType, srcPath, buildPath, callback){
    var compiler = config.compile[srcType];
    if(!compiler)
        return callback(new Error('源码类型'+srcType+'没有配置对应的编译器'));

    cp.execFile(compileShell,[compiler,srcPath,buildPath],function(err){
       if(err){
           return callback(err, null);
       }
       callback();
    });
};