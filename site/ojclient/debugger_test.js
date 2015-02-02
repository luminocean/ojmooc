/**
 * 用于测试oj客户端的测试用例文件，可以作为如何使用该客户端的参考
 */
var fs = require('fs');
var dbr = require('./app.js').debugger;

//设置访问runner的端口
dbr.setPort(23333);

//测试的编译类型
var srcType = 'cpp';
//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/'+srcType+'_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/'+srcType+'_data','utf-8');

dbr.debug(srcCode,srcType,inputData,function(err,debugId) {
    if (err) return console.error(err);

    dbr.breakPoint(debugId,[18],function(){
        dbr.run(debugId,function(err,exit,breakPoint){
            console.log(exit);
            console.log(JSON.stringify(breakPoint));
            dbr.continue(debugId,function(err,exit){
               console.log(exit);
            });
        });
    });
});




