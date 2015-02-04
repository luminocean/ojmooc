/**
 * 用于测试oj客户端的测试用例文件，可以作为如何使用该客户端的参考
 */
var fs = require('fs');
var Q = require('q');
var dbr = require('./app.js').debugger;

//设置访问runner的端口
dbr.setPort(23333);

//测试的编译类型
var srcType = 'cpp';
//读取测试用源文件
var srcCode = fs.readFileSync('./input_data/'+srcType+'_code','utf-8');
//读取测试用数据
var inputData = fs.readFileSync('./input_data/'+srcType+'_data','utf-8');

var debugId = null;
//开启debug会话
Q.denodeify(dbr.debug)(srcCode,srcType,inputData)
    //加入断点
    .then(function(id){
        debugId = id;
        return Q.denodeify(dbr.breakPoint)(debugId,[16]);
    })
    //运行程序
    .then(function(){
        return Q.denodeify(dbr.run)(debugId);
    })
    //查看断点信息
    .then(function(results){
        console.log(JSON.stringify(results[1]));
        console.log('--'+JSON.stringify(results[3]));
    })
    //查看变量值
    /*.then(function(){
        return Q.denodeify(dbr.printVal)(debugId,'indata');
    })
    .then(function(value){
        console.log('value of lastname:'+value);
    })*/
    //继续程序
    .then(function(){
        return Q.denodeify(dbr.continue)(debugId);
    })
    //退出程序
    .then(function(results){
        if(results[0])
            console.log('exiting...');

        return Q.denodeify(dbr.exit)(debugId);
    })
    .then(function(debugId){
        console.log(debugId+' exited');
    })
    .catch(function(err){
        console.error(err.stack);
    });




