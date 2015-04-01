/**
 * Created by savio on 2015/3/21.
 */

var debugId;
var stdout = "";
var breakpoints = [];
var variables = {};

var editor = ace.edit("editor");
var inputEditor = ace.edit("inputEditor");
var outputEditor = ace.edit("outputEditor");

$(document).ready(function () {
    $("#leftPanel").hide();
    $("#rightPanel").hide();
    $("#debugBegin").hide();
    $("#debugOut").hide();

    //消除console的警告
    editor.$blockScrolling = Infinity;
    inputEditor.$blockScrolling = Infinity;
    outputEditor.$blockScrolling = Infinity;

    ace.require("ace/ext/language_tools");

    inputEditor.setTheme("ace/theme/twilight");
    outputEditor.setTheme("ace/theme/twilight");
    editor.setTheme("ace/theme/twilight");
    outputEditor.setReadOnly(true);
    editor.getSession().setMode("ace/mode/c_cpp");

    //设置代码自动补全
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
});

$("#fontsize").change(function () {
    var size = $("#fontsize").val();
    $("#editor").css("font-size", size);

});

$("#language").change(function () {
    var session = editor.getSession();
    var lan = $("#language").val();

    switch (lan) {
        case "cpp":
            session.setMode("ace/mode/c_cpp");
            break;
        case "pas":
            session.setMode("ace/mode/pascal");
            break;
        case "bas":
            session.setMode("ace/mode/qbasic");
            break;
        case "default":
            break;
    }
});

function check() {
    $("#fontsize").val("12px");
    $("#language").val("cpp");
}

//运行模块
$("#run").click(function () {
    var code = editor.getValue();
    var lan = $("#language").val();
    var params = inputEditor.getValue().trim();

    $.ajax({
        type: "POST",
        url: "/editor/run",
        data: {code: code, language: lan, params: params},
        dataType: "text",
        success: function (result) {
            outputEditor.setValue(result);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!");
        }
    });
});

//debug模块
$("#debugInto").click(function () {
    $("#midPanel").removeClass("col-sm-10").addClass("col-sm-6");
    $("#leftPanel").show();
    $("#rightPanel").show();
    $("#debugBegin").show();
    $("#debugOut").show();
    $("#debugInto").hide();
    $("#run").hide();
});

$("#debugOut").click(function () {
    $("#midPanel").removeClass("col-sm-6").addClass("col-sm-10");
    $("#leftPanel").hide();
    $("#rightPanel").hide();
    $("#debugBegin").hide();
    $("#debugOut").hide();
    $("#debugInto").show();
    $("#run").show();
});

$("#debugBegin").click(function(){

    //清空stdout，locals
    stdout = "";
    $("#localsTb").empty();
    $("#variableTb").empty();

    //设置debugstatus
    editor.setDebugStatus(true);

    var code = editor.getValue();
    var lan = $("#language").val();
    var params = inputEditor.getValue().trim();
    var bplines = [];

    breakpoints = editor.getSession().$breakpoints;

    for(var bp in breakpoints ){
        bplines.push(bp);
    }

    $.ajax({
        type: "POST",
        url: "/editor/debugBegin",
        data: {code: code, language: lan, params: params,bps: bplines},
        dataType: "json",
        success: function (msg) {
            debugId = msg.debugId;
            stdout +=msg.stdout;
            printLocals(msg.locals);
            editor.setDebugId(debugId);
            outputEditor.setValue(stdout);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!");
        }
    });
});

$("#stepInto").click(function(){

    $.ajax({
        type: "POST",
        url: "/editor/stepInto",
        data: {debugId: debugId},
        dataType: "json",
        success: function (msg) {
            stdout += msg.stdout;
            console.log(stdout);
            outputEditor.setValue(stdout);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!");
        }
    });
});

$("#stepOver").click(function(){
    $.ajax({
        type: "POST",
        url: "/editor/stepOver",
        data: {debugId: debugId},
        dataType: "json",
        success: function (msg) {
            stdout += msg.stdout;
            outputEditor.setValue(stdout);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!");
        }
    });
});

$("#continue").click(function(){
    console.log(variables);
    $.ajax({
        type: "POST",
        url: "/editor/continue",
        data: {debugId: debugId},
        dataType: "json",
        success: function (msg) {
            stdout += msg.stdout;
            //console.log(msg.locals);
            printVariables(variables);
            printLocals(msg.locals);
            outputEditor.setValue(stdout);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!");
        }
    });
});

$("#exit").click(function(){
    $.ajax({
        type: "POST",
        url: "/editor/exit",
        data: {debugId: debugId},
        dataType: "json",
        success: function (msg) {
            stdout += msg.stdout;
            outputEditor.setValue(stdout);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!");
        }
    });
});

$("#addVariableBtn").click(function(){
    var variableName = $("#variable-name").val();
    $("#addVariable").modal("hide");
    $("#variablesTb").append("<tr><td>"+variableName+"</td><td>"+"undefined"+"</td></tr>");
    $(variables).attr(variableName,"undefined");
});

$("#closeModalBtn").click(function(){
   $("#addVariable").modal("hide");
});

function printLocals(locals){
    for (var key in locals) {
        //console.log(key);
        //console.log(locals[key]);
        $("#localsTb").append("<tr><td>"+key+"</td><td>"+locals[key]+"</td></tr>");
    }
}

function printVariables(variables){
    $("#variableTb").empty();
    $.ajax({
        type: "POST",
        url: "/editor/printVariables",
        data: {debugId: debugId,variables:variables},
        success: function (msg) {
            for(var key in msg){
                console.log(key);
                console.log(msg[key]);
                $("#variablesTb").append("<tr><td>"+key+"</td><td>"+msg[key]+"</td></tr>");
            }
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!");
        }
    });


}