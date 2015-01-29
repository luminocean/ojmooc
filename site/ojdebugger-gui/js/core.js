var request = require('request');

var config = [
    {
        "id":"debugBtn",
        "handler":debug
    },
    {
        "id":"printValBtn",
        "handler":printVal
    },
    {
        "id":"stepIntoBtn",
        "handler":stepInto
    },
    {
        "id":"stepOverBtn",
        "handler":stepOver
    },
    {
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

function printVal(){
    var debugId = $('#debugId').val();
    var varName = $('#varName').val();
    if(!varName){
        console.error('没有给定要查看的变量名');
        return;
    }

    sendRequest({
        "printVal":{
            "debugId":debugId,
            "valName":varName
        }
    },function(err,result){
        $('#varVal').val(result['value']);
    });
}

function debug(){
    var programName = $('#programName').val();
    var breakLine = $('#breakLine').val();

    if(!programName||!breakLine){
        console.error('程序名或断点位置未设定:'+programName+" & "+breakLine);
        return;
    }

    sendRequest({
        "suit":{
            "programName":programName,
            "breakLines":[breakLine]
        }
    },function(err,result){
        if(err)
            return console.log(err);

        var debugId = result.debugId;
        $("#debugId").val(debugId);
        display(JSON.stringify(result));
    });
}

function stepInto(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    sendRequest({
        "stepInto":{
            "debugId":debugId
        }
    },function(err,result){
        if(err) return console.error(err);

        display(JSON.stringify(result));
    });
}

function stepOver(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    sendRequest({
        "stepOver":{
            "debugId":debugId
        }
    },function(err,result){
        if(err) return console.error(err);

        display(JSON.stringify(result));
    });
}

//continue
function ctn(){
    var debugId = $('#debugId').val();
    if(!debugId) return console.error('找不到从服务器获取的debugId，是否正处于调试？');

    sendRequest({
        "continue":{
            "debugId":debugId
        }
    },function(err,result){
        if(err) return console.error(err);

        display(JSON.stringify(result));
    });
}

function sendRequest(object,callback){
    var requestObj = {
        "url":"http://localhost:23333",
        "method":"POST",
        "json":true,
        "body":object
    };
    request(requestObj, function (err, response, body) {
        if(err)
            return callback(err);

        callback(null,body);
    });
}

function display(text){
    $("#output").text(text);
}