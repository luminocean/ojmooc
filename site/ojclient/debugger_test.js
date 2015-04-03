#!/usr/bin/nodejs
/**
 * 用于测试oj客户端的测试用例文件，可以作为如何使用该客户端的参考
 */
var fs = require('fs');
var path = require('path');
var Q = require('q');
var dbr = require('./app.js').debugger;

//设置访问runner的端口
dbr.setPort(8081);
//dbr.setPort(23333);
//dbr.setPort(49154);

dbr.setHost('121.42.155.75');

Q.longStackSupport = true;

//测试的编译类型
var srcType = 'cpp';

//读取测试用源文件
var srcCode = fs.readFileSync(path.join(__dirname,'./input_data/code.'+srcType),'utf-8');
//读取测试用数据
var inputData = fs.readFileSync(path.join(__dirname,'./input_data/'+srcType+'.data'),'utf-8');

var currentDebugId = null;

//执行launchDebug
Q.denodeify(dbr.launchDebug)(srcCode, srcType, inputData, [25,28])
    .then(function (results) {
        console.log('launchDebug ---> '+JSON.stringify(results));
        currentDebugId = results[0];
        //进入函数
        return Q.denodeify(dbr.stepInto)(currentDebugId);
    })
    .then(function(results){
        console.log('step into ---> '+JSON.stringify(results));
        //退出函数
        return Q.denodeify(dbr.finishFunction)(currentDebugId);
    })
    .then(function(lineNum){
        console.log('退出函数的行号 ---> '+lineNum);
        return Q.denodeify(dbr.stepOver)(currentDebugId);
    })
    .then(function(results){
        console.log('step over ---> '+JSON.stringify(results));
        //查看值
        return Q.denodeify(dbr.printVal)(currentDebugId,["acc"]);
    })
    .then(function(value){
        console.log('acc的值 ---> '+value["acc"]);
        //继续到下一个断点
        return Q.denodeify(dbr.continue)(currentDebugId);
    })
    .then(function(results){
        console.log('continue ---> '+JSON.stringify(results));
        return Q.denodeify(dbr.exit)(currentDebugId);
    })
    .then(function(results){
        console.log('exit ---> '+JSON.stringify(results));
    })
    .catch(function (err) {
        console.error(err);
    })
    .done();

