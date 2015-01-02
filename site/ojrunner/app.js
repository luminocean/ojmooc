var fs = require('fs');
var path = require('path');
var Q = require('q');
var compile = require('./compile.js');
var exec = require('./exec.js');
var util = require('./util/util.js');

//ojrunner对象
var or = {};
//将ojrunner对象导出
module.exports = or;

//要编译的源文件存放处
var srcRepo = 'src_repo';
//编译完的可执行文件的存放处
var buildRepo = 'build_repo';

/**
 * 编译执行的入口方法
 * @param srcCode 需要编译源代码
 * @param inputData 执行程序的输入数据
 * @param srcType 源码类型（是哪种源程序文件）
 * @param callback 执行后的回调函数
 * @param callback
 */
or.run = function(srcCode, inputData, srcType, callback){
    //程序名
    var programName = util.generateFileName();
    //构造源程序全路径
    var srcName = programName+'.'+srcType;
    var srcFullPath = path.join(__dirname, srcRepo, srcName);

    //生成源文件
    Q.denodeify(fs.writeFile)(srcFullPath, srcCode)
        //生成源文件成功后编译文件
        .then(function(){
            //构造可执行程序的全路径
            var buildFullPath = path.join(__dirname, buildRepo, programName);
            return Q.denodeify(compile.compile)(srcFullPath, buildFullPath);
        })
        //编译成功后执行
        .then(function(){
            return Q.denodeify(exec.exec)(programName, inputData);
        })
        //将结果传回调用方
        .then(function(result){
            //执行成功时回传结果
            callback(null, result);
        },function(err){
            //失败时回传错误
            callback(err, null);
        })
        //清理临时文件
        .then(function(){
            util.cleanup(programName,[srcRepo,buildRepo]);
        });
};
