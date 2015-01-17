/**
 * 业务逻辑的入口，负责根据网络层传来的请求参数进行编译执行，最后返回结果
 */
var fs = require('fs');
var path = require('path');
var Q = require('q');
var compile = require('./compile.js');
var exec = require('./exec.js');
var util = require('../util/util.js');
var config = require('../config/config.js');

//要编译的源文件的存放路径
var srcPath = path.join(__dirname,'../',config.repo.dir.src);
//编译完的可执行文件的存放路径
var buildPath = path.join(__dirname,'../',config.repo.dir.build);
//报告文件存放路径
var reportPath = path.join(__dirname,'../',config.repo.dir.report);

/**
 * 编译执行的入口方法
 * @param srcCode
 * @param inputData
 * @param srcType
 * @param callback
 */
exports.run = function(srcCode, inputData, srcType, callback){
    //程序名
    var programName = util.generateFileName();
    //构造源程序文件名和路径
    var srcName = programName+'.'+srcType;
    var srcFilePath = path.join(srcPath, srcName);

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