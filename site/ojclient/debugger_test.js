/**
 * 用于测试oj客户端的测试用例文件，可以作为如何使用该客户端的参考
 */
var fs = require('fs');
var Q = require('q');
var dbr = require('./app.js').debugger;

//设置访问runner的端口
//dbr.setPort(23333);
dbr.setPort(49169);

//测试的编译类型
var srcType = 'cpp';
//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/'+srcType+'_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/'+srcType+'_data','utf-8');

Q.denodeify(dbr.launchDebug)(srcCode,srcType,inputData,[16])
    .then(function(results){
        console.log(JSON.stringify(results));
    })
    .catch(function(err){
        console.error(err);
    });