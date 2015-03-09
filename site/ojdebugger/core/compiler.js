/**
 * 编译模块
 */
var cp = require('child_process');
var util = require('../util/util');
var config = require('../config/config.js').settings;

//执行编译任务的shell文件的位置
var compileShellPath = util.absPath(config.shell.compile);

/**
 * 执行编译的方法
 * @param srcFileType 源码类型
 * @param srcFilePath 需要编译的已存在的源文件的路径
 * @param buildFilePath 将要生成的可执行文件的路径
 * @param callback 完成后的回调函数
 */
exports.compile = function(srcFileType, srcFilePath, buildFilePath, callback){
    var compiler = config.compile.compiler[srcFileType];
    if(!compiler)
        return callback(new Error('源码类型'+srcFileType+'没有配置对应的编译器'));

    //设置编译时间上限
    var options = {"timeout":config.compile.limit.timeout};

    cp.execFile(compileShellPath,[compiler,srcFilePath,buildFilePath],options,
        function(err){
            if(err) return callback(err);
            callback();
    });
};