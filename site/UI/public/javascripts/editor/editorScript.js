/**
 * Created by savio on 2015/3/21.
 */

var debugId;
var stdout = "";
var breakpoints = [];
var variables = [];

var editor = ace.edit("editor");
var inputEditor = ace.edit("inputEditor");
var outputEditor = ace.edit("outputEditor");
var editorWidth = document.getElementById("editerDiv").clientWidth;

$(document).ready(function () {

    //$("#inputEditor").css({"width":editorWidth*0.48});
    //$("#outputEditor").css({"width":editorWidth*0.48});
    //$("#leftPanel").css({"width":editorWidth*0.24});
    //$("#rightPanel").css({"width":editorWidth*0.24});
    //$("#editor").css({"width":editorWidth*0.96});
    //$("#midPanel").css({"width":editorWidth*0.97});

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
    var action = new fontChange(size);
    sendActionOverEditor(action);
    $("#editor").css("font-size", size);

});

$("#language").change(function () {
    var session = editor.getSession();
    var lan = $("#language").val();

    var action = new languageChange(lan);
    sendActionOverEditor(action);

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
            outputEditor.setValue(result,-1);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!",-1);
        }
    });
});
//debug模块
$("#debugInto").click(function () {
    var action = new debugIntoChange();
    sendActionOverEditor(action);
    runToDebug();
});

$("#debugOut").click(function () {
    var action = new debugOutChange();
    sendActionOverEditor(action);
    debugToRun();
});

function runToDebug(){
    //$("#editor").css({"width":editorWidth*0.48});
    //$("#inputEditor").css({"width":editorWidth*0.24});
    //$("#outputEditor").css({"width":editorWidth*0.24});
    //$("#midPanel").css({"width":editorWidth*0.49});
    $("#midPanel").removeClass("col-sm-12").addClass("col-sm-6");
    $("#leftPanel").show();
    $("#rightPanel").show();
    $("#debugBegin").show();
    $("#debugOut").show();
    $("#debugInto").hide();
    $("#run").hide();
}

function debugToRun(){
    //$("#editor").css({"width":editorWidth*0.96});
    //$("#inputEditor").css({"width":editorWidth*0.48});
    //$("#outputEditor").css({"width":editorWidth*0.48});
    //$("#midPanel").css({"width":editorWidth*0.97});
    $("#midPanel").removeClass("col-sm-6").addClass("col-sm-12");
    $("#leftPanel").hide();
    $("#rightPanel").hide();
    $("#debugBegin").hide();
    $("#debugOut").hide();
    $("#debugInto").show();
    $("#run").show();
}


$("#debugBegin").click(function () {


    //清空stdout，locals
    stdout = "";
    $("#localsTb").empty();
    $("#variableTb").empty();
    $("#breakpointsTb").empty();

    //设置debugstatus
    editor.setDebugStatus(true);

    var code = editor.getValue();
    var lan = $("#language").val();
    var params = inputEditor.getValue().trim();
    var bplines = [];
    breakpoints = editor.getSession().$breakpoints;
    for (var bp in breakpoints) {
        bplines.push(bp);
    }
    $.ajax({
        type: "POST",
        url: "/editor/debugBegin",
        data: {code: code, language: lan, params: params, bps: bplines},
        dataType: "json",
        success: function (msg) {
            debugId = msg.debugId;
            stdout += msg.stdout;
            printLocals(msg.locals);
            editor.setDebugId(debugId);
            outputEditor.setValue(stdout,-1);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!",-1);
        }
    });
});

$("#stepInto").click(function () {
    step("/editor/stepInto", debugId);
});

$("#stepOver").click(function () {
    step("/editor/stepOver", debugId);
});

$("#continue").click(function () {
    step("/editor/continue", debugId);
});

$("#exit").click(function () {
    $.ajax({
        type: "POST",
        url: "/editor/exit",
        data: {debugId: debugId},
        dataType: "json",
        success: function (msg) {
            stdout += msg.stdout;
            outputEditor.setValue(stdout,-1);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!",-1);
        }
    });
});

$("#addVariableBtn").click(function () {
    var variableName = $("#variable-name").val();
    $("#addVariable").modal("hide");
    $("#variablesTb").append("<tr><td>" + variableName + "</td><td>" + "undefined" + "</td></tr>");
    variables.push(variableName);
});

$("#closeModalBtn").click(function () {
    $("#addVariable").modal("hide");
});

function printLocals(locals) {
    for (var key in locals) {
        $("#localsTb").append("<tr><td>" + key + "</td><td>" + locals[key] + "</td></tr>");
    }
}

function printVariables(variables) {
    $("#variableTb").empty();
    $.ajax({
        type: "POST",
        url: "/editor/printVariables",
        data: {debugId: debugId, variables: variables},
        success: function (msg) {
            console.log(msg);
            for (var key in msg) {
                $("#variablesTb").append("<tr><td>" + key + "</td><td>" + msg[key] + "</td></tr>");
            }
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!",-1);
        }
    });


}

function printBreakpoints(breakpoints){
    for (var key in breakpoints) {
        $("#breakpointsTb").append("<tr><td>" + key + "</td><td>"+"breakpoint"+ "</td></tr>");
    }
}

function step(url, debugId) {
    $("#variablesTb").empty();
    breakpoints = editor.getSession().$breakpoints;
    printBreakpoints(breakpoints);
    $.ajax({
        type: "POST",
        url: url,
        data: {debugId: debugId},
        dataType: "json",
        success: function (msg) {
            stdout += msg.stdout;
            printVariables(variables);
            printLocals(msg.locals);
            outputEditor.setValue(stdout,-1);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!",-1);
        }
    });
}
