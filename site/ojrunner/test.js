var fs = require('fs');
var or = require('./app.js');

var inputData = '';
console.log(__dirname);
//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/src_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/data','utf-8');

or.run(srcCode, inputData, function(err, result, params){
    if(err){
        console.log(err);
        return;
    }

    console.log(result);
});