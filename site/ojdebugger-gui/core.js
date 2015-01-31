var client = require('./debugger-client/index');

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

function launchDebug(){
    var programName = $('#programName').val();
    if(!programName) return console.error('没有指定程序名');
    var breakLine = $('#breakLine').val();

    client.launchDebug(programName,[breakLine],function(err,debugId,exit,breakPoint){
        if(err) return callback(err);

        $("#debugId").val(debugId);
        display((exit?'exit:':'')+JSON.stringify(breakPoint));
    });
}

function printVal(){
    var debugId = $('#debugId').val();
    var varName = $('#varName').val();
    if(!varName){
        console.error('没有给定要查看的变量名');
        return;
    }

    client.printVal(debugId,varName,function(err,value){
        if(err) return display(err.message);

        $('#varVal').val(value);
    });
}

function stepInto(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    client.stepInto(debugId,function(err,exit,breakPoint){
        if(err) return callback(err);

        display((exit?'exit:':'')+JSON.stringify(breakPoint));
    });
}

function stepOver(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    client.stepOver(debugId,function(err,exit,breakPoint){
        if(err) return callback(err);

        display((exit?'exit:':'')+JSON.stringify(breakPoint));
    });
}

//continue
function ctn(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    client.continue(debugId,function(err,exit,breakPoint){
        if(err) return callback(err);

        display((exit?'exit:':'')+JSON.stringify(breakPoint));
    });
}

function exit(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    client.exit(debugId,function(err,debugId){
        if(err) return callback(err);

        display('DEBUG OVER:'+debugId);
    });
}

function display(text){
    $("#output").text(text);
}