var fs = require('fs');
var or = require('./app.js');

//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/src_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/data','utf-8');
//测试的编译类型
var srcType = 'cpp';

or.run(srcCode, inputData, srcType, function(err, result){
    if(err){
        console.log(err);
        return;
    }

    console.log("测试结果:"+result);
});