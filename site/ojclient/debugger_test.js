#!/usr/bin/nodejs
/**
 * 用于测试oj客户端的测试用例文件，可以作为如何使用该客户端的参考
 */
var fs = require('fs');
var Q = require('q');
var dbr = require('./app.js').debugger;

//设置访问runner的端口
dbr.setPort(8081);
//dbr.setPort(23333);
//dbr.setPort(49154);

//dbr.setHost('121.42.155.75');

Q.longStackSupport = true;

//测试的编译类型
var srcType = 'cpp';
//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/'+srcType+'_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/'+srcType+'_data','utf-8');


/*Q.denodeify(dbr.launchDebug)(srcCode, srcType, inputData, [16])
 .then(function (results) {
 console.log(JSON.stringify(results));
 return results[0];
 })
 .then(function(debugId){
 return Q.denodeify(dbr.exit)(debugId);
 })
 .catch(function (err) {
 console.error(err);
 });*/

var currentDebugId = null;

Q.denodeify(dbr.launchDebug)(srcCode, srcType, inputData, [27])
    .then(function (results) {
        console.log(JSON.stringify(results));
        return results[0];
    })
    .then(function(debugId){
        currentDebugId = debugId;
        return Q.denodeify(dbr.printVal)(debugId,"acc");
    })
    .then(function(value){
        console.log("value:"+value);
        return currentDebugId;
    })
    .then(function(debugId){
        return Q.denodeify(dbr.exit)(debugId);
    })
    .catch(function (err) {
        console.error(err);
    });