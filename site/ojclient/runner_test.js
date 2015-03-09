#!/usr/bin/nodejs
/**
 * 用于测试oj客户端的测试用例文件，可以作为如何使用该客户端的参考
 */
var fs = require('fs');
var runner = require('./app.js').runner;

//设置访问runner的端口
//runner.setPort(8080);
//runner.setPort(49154);
runner.setPort(23333);

//runner.setHost('121.42.155.75');

//测试的编译类型
var srcType = 'cpp';
//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/'+srcType+'_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/'+srcType+'_data','utf-8');

for(var i=0; i<10; i++){
    runner.run(srcCode,srcType,inputData,function(err,result,params,host) {
        if (err) return console.error(err);

        console.log(host+':\n'+result + JSON.stringify(params));
        console.log();
    });
}



