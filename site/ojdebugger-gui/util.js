var fs = require('fs');

/**
 * 获取指定后缀的代码和输入数据
 * callback(err,sourceCode,inputData)
 */
exports.getData = function(suffix,callback){
    var sourceFileName = "code."+suffix;
    var inputFileName = suffix+'.data';

    fs.readFile('./input_data/'+sourceFileName,function(err,sourceCode){
        if(err) callback(err);
        fs.readFile('./input_data/'+inputFileName,function(err,inputData){
           callback(null,sourceCode.toString(),inputData.toString());
        });
    })
};