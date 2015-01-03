var fs = require('fs');
var or = require('./app.js');

//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/src_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/data','utf-8');
//测试的编译类型
var srcType = 'cpp';

or.run(srcCode, inputData, srcType, function(err, result, params){
    if(err){
        return console.log("运行异常:"+err);
    }
    console.log("运行结果:"+result);
    console.log("运行参数:"+JSON.stringify(params));
});