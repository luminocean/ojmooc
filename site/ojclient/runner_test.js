/**
 * 用于测试oj客户端的测试用例文件，可以作为如何使用该客户端的参考
 */
var fs = require('fs');
var runner = require('./app.js').runner;

//设置访问runner的端口
//runner.setPort(8080);
runner.setPort(49168);

//测试的编译类型
var srcType = 'pas';
//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/'+srcType+'_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/'+srcType+'_data','utf-8');

for(var i=0; i<5; i++){
    runner.run(srcCode,srcType,inputData,function(err,result,params) {
        if (err) return console.error(err);

        console.log(result);
        console.log(JSON.stringify(params));
    });
}



