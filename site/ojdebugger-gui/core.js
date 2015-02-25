var util = require('./util');
//引用同目录下的ojclient
var dbr = require('../ojclient/app').debugger;

dbr.setPort(23333);

var config = [
    {
        "id":"debugBtn",
        "handler":launchDebug
    },{
        "id":"exitBtn",
        "handler":exit
    },{
        "id":"printValBtn",
        "handler":printVal
    },{
        "id":"stepIntoBtn",
        "handler":stepInto
    },{
        "id":"stepOverBtn",
        "handler":stepOver
    },{
        "id":"continueBtn",
        "handler":ctn
    }
];

//设置按钮的监听
config.forEach(function(item){
    $('#'+item['id']).on('click',function(e){
        e.preventDefault();
        item['handler']();
    });
});

/**
 * gui侧启动debug(debug+breakPoint+run)
 * @returns {*}
 */
function launchDebug(){
    var programSuffix = $('#programSuffix').val();
    if(!programSuffix) return console.error('没有指定程序后缀');
    var breakLines = $('#breakLine').val().split(',');
    console.log(breakLines);

    util.getData(programSuffix,function(err,sourceCode,inputData){
        if(err) return console.error(err.stack);

        dbr.launchDebug(sourceCode,programSuffix,inputData,breakLines,function(err,debugId,exit,breakPoint,stdout,locals){
            if(err) return console.error(err.stack);

            displayInfo(debugId,exit,breakPoint,stdout,locals);
        });
    });
}

function printVal(){
    var debugId = $('#debugId').val();
    var varName = $('#varName').val();
    if(!varName){
        console.error('没有给定要查看的变量名');
        return;
    }

    dbr.printVal(debugId,varName,function(err,value){
        if(err) return display(err.message);

        $('#varVal').val(value);
    });
}

function stepInto(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    dbr.stepInto(debugId,function(err,exit,breakPoint,stdout,locals){
        if(err) return callback(err);

        displayInfo(debugId,exit,breakPoint,stdout,locals);
    });
}

function stepOver(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    dbr.stepOver(debugId,function(err,exit,breakPoint,stdout,locals){
        if(err) return callback(err);

        displayInfo(debugId,exit,breakPoint,stdout,locals);
    });
}

//continue
function ctn(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    dbr.continue(debugId,function(err,exit,breakPoint,stdout,locals){
        if(err) return callback(err);

        displayInfo(debugId,exit,breakPoint,stdout,locals);
    });
}

function exit(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    dbr.exit(debugId,function(err,debugId){
        if(err) return callback(err);

        display('DEBUG OVER:'+debugId);
    });
}

/**
 * 将返回的数据填充到界面的对应位置上
 * @param debugId
 * @param exit
 * @param breakPoint
 * @param stdout
 * @param locals
 */
function displayInfo(debugId,exit,breakPoint,stdout,locals){
    $("#debugId").val(debugId);
    display('response','debugId:'+debugId
    +'\nexit:'+exit
    +'\nbreakPoint:'+JSON.stringify(breakPoint)
    +'\nstdout:'+JSON.stringify(stdout)
    +'\nlocals:'+JSON.stringify(locals));

    if(stdout)
        display('stdout',stdout.toString());

    if(locals){
        var localsStr = '';
        for(var key in locals){
            if(!locals.hasOwnProperty(key)) continue;

            localsStr += key+':'+locals[key]+'\n';
        }
        display('locals',localsStr);
    }
}

function display(type,text){
    $("#"+type).text(text);
}