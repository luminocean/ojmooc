//获取外部依赖模块
var fs = require('fs');
var Q = require('q');
//获取内部模块
var compile = require('./core/compile.js');
var exec = require('./core/exec.js');
var util = require('./util/util.js');
//获取配置信息
var config = require('./config/config.js');

//ojrunner对象
var or = {};
//将ojrunner对象导出
module.exports = or;

//要编译的源文件的存放路径
var srcPath = __dirname+config.repo.dir.src;
//编译完的可执行文件的存放路径
var buildPath = __dirname+config.repo.dir.build;
//报告文件存放路径
var reportPath = __dirname+config.repo.dir.report;

//准备好临时目录,只执行一次
util.prepareDir();

/**
 * 编译执行的入口方法
 * @param srcCode 需要编译源代码
 * @param inputData 执行程序的输入数据
 * @param srcType 源码类型（是哪种源程序文件）
 * @param callback 执行后的回调函数
 */
or.run = function(srcCode, inputData, srcType, callback){
    //程序名
    var programName = util.generateFileName();
    //构造源程序文件名和路径
    var srcName = programName+'.'+srcType;
    var srcFilePath = srcPath+'/'+srcName;

    //使用Q控制流框架优化代码结构
    //生成源文件
    Q.denodeify(fs.writeFile)(srcFilePath, srcCode)
        //生成源文件成功后编译文件
        .then(function(){
            //构造可执行程序的路径
            var buildFilePath = buildPath+'/'+programName;
            return Q.denodeify(compile.compile)(srcType, srcFilePath, buildFilePath);
        })
        //编译成功后执行
        .then(function(){
            return Q.denodeify(exec.exec)(programName, inputData);
        })
        //将结果传回调用方
        .then(function(results){
            var result = results[0];
            var params = results[1];
            //执行成功时回传结果
            callback(null, result, params);
        },function(err){
            //失败时回传错误
            callback(err);
        })
        //清理临时文件
        .then(function(){
            util.cleanup(programName,[srcPath,buildPath,reportPath]);
        });
};

/**
 * 捕获致命错误，防止进程意外崩溃
 */
process.on('uncaughtException',function(err){
    console.log("致命错误："+err);
});