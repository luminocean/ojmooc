var request = require('request');

//设置调试按钮的监听
$('#debugBtn').on('click',function(e){
    e.preventDefault();

    debug();
});

//设置变量查看按钮的监听
$('#printValBtn').on('click',function(e){
    e.preventDefault();

    printVal();
});

function printVal(){
    var debugId = $('#debugId').val();
    var varName = $('#varName').val();
    if(!varName){
        console.log('没有给定要查看的变量名');
        return;
    }

    sendRequest({
        "printVal":{
            "debugId":debugId,
            "valName":varName
        }
    },function(err,result){
        $("#output").text(result['value']);
    });
}

/**
 * 开启debug模式
 */
function debug(){
    var programName = $('#programName').val();
    var breakLine = $('#breakLine').val();

    if(!programName||!breakLine){
        console.error('程序名或断点位置未设定:'+programName+" & "+breakLine);
        return;
    }

    sendRequest({
        "debug":{
            "programName":programName,
            "breakLine":breakLine
        }
    },function(err,result){
        if(err)
            return console.log(err);

        var debugId = result.debugId;
        $("#debugId").val(debugId);
        $("#output").text(JSON.stringify(result));
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