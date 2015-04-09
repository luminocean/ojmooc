/**
 * Created by savio on 2015/3/21.
 */

var debugId;
var stdout = "";
var breakpoints = [];
var variables = [];
var exitMessage = "程序调试结束！";

var editor = ace.edit("editor");
var inputEditor = ace.edit("inputEditor");
var outputEditor = ace.edit("outputEditor");

//var Range = ace.require("ace/range").Range;
//var range = new Range(0, 0, 0, 0);
var marker;

$(document).ready(function () {

    $("#leftPanel").hide();
    $("#debugOptionPanel").hide();

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
    disableBtn();
});

//    var Range = ace.require("ace/range").Range;
//    var range = new Range(3,0,3,144);
//    console.log(range);
//    var marker = editor.session.addMarker(range, "warning", "fullLine");
//    content = editor.session.getTextRange(selectionRange);

editor.getSession().selection.on("changeSelection", function () {
    var range = editor.getSelectionRange();
    var action = new selectionChange(range);
    sendActionOverEditor(action);
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

//run模块
$("#run").click(function () {
    var code = editor.getValue();
    var lan = $("#language").val();
    var params = inputEditor.getValue().trim();

    //清空显示界面
    stdout = "";
    outputEditor.setValue("", -1);
    $.ajax({
        type: "POST",
        url: "/play/editor/run",
        data: {code: code, language: lan, params: params},
        dataType: "json",
        success: function (msg) {
            stdout += msg.result;
            stdout += msg.message;
            outputEditor.setValue(stdout, -1);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!", -1);
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

function runToDebug() {
    $("#midPanel").removeClass("col-sm-12").addClass("col-sm-8");
    $("#leftPanel").show();
    $("#debugOptionPanel").show();
    $("#debugInto").hide();
    $("#run").hide();
}

function debugToRun() {
    $("#midPanel").removeClass("col-sm-8").addClass("col-sm-12");
    $("#leftPanel").hide();
    $("#debugOptionPanel").hide();
    $("#debugInto").show();
    $("#run").show();
}


$("#debugBegin").click(function () {

    //设置debugstatus
    editor.setDebugStatus(true);
    activeBtn();

    var message = "调试开始!\r\n";
    var code = editor.getValue();
    var lan = $("#language").val();
    var params = inputEditor.getValue().trim();
    var bplines = [];
    breakpoints = editor.getSession().$breakpoints;

    //清空界面数据
    stdout = "";
    $("#variablesTb").empty();
    $("#breakpointsTb").empty();
    $("#localsTb").empty();

    for (var bp in breakpoints) {
        bplines.push(bp);
    }

    $.ajax({
        type: "POST",
        url: "/play/editor/debugBegin",
        data: {code: code, language: lan, params: params, 'bps[]': bplines},
        dataType: "json",
        success: function (msg) {
            debugId = msg.debugId;

            stdout += message;
            stdout += msg.stdout;
            editor.setDebugId(debugId);

            outputEditor.setValue(stdout, -1);
            printLocals(msg.locals);
            printVariables(variables);

            if (msg.finish) {
                stdout += exitMessage;
                exitDebug(debugId);
                outputEditor.setValue(stdout, -1);
            } else {
                highlightLine(msg.breakPoint.lineNum);
            }
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!", -1);
        }
    });
})
;

$("#stepInto").click(function () {
    step("/play/editor/stepInto", debugId);
});

$("#stepOver").click(function () {
    step("/play/editor/stepOver", debugId);
});

$("#continue").click(function () {
    step("/play/editor/continue", debugId);
});

$("#exit").click(function () {
    exitDebug(debugId);
    stdout += exitMessage;
    outputEditor.setValue(stdout, -1);
});


$("#addVariableBtn").click(function () {
    var variableName = $("#variable-name").val();
    $("#addVariable").modal("hide");
    $("#variablesTb").append("<tr><td>" + variableName + "</td>" +
    "<td>" + "undefined" + "</td>" +
    "<td><span class='glyphicon glyphicon-remove'></span><td></tr>");
    variables.push(variableName);
});

$(".glyphicon.glyphicon-remove").on("click",function () {
    console.log("hello");
    $(this).parent().parent().remove();
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
        url: "/play/editor/printVariables",
        data: {debugId: debugId, variables: variables},
        success: function (msg) {
            for (var key in msg) {
                $("#variablesTb").append("<tr><td>" + key + "</td><td>" + msg[key] + "</td></tr>");
            }
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!", -1);
        }
    });


}

function step(url, debugId) {
    breakpoints = editor.getSession().$breakpoints;
    $.ajax({
        type: "POST",
        url: url,
        data: {debugId: debugId},
        dataType: "json",
        success: function (msg) {
            stdout += msg.stdout;
            outputEditor.setValue(stdout, -1);
            printVariables(variables);
            printLocals(msg.locals);
            removeHighLightLine(marker);
            if (msg.finish) {
                stdout += exitMessage;
                exitDebug(debugId);
                outputEditor.setValue(stdout, -1);
            } else {
                highlightLine(msg.breakPoint.lineNum);
            }
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!", -1);
        }
    });
}

function exitDebug(debugId) {
    removeHighLightLine(marker);
    $.ajax({
        type: "POST",
        url: "/play/editor/exit",
        data: {debugId: debugId},
        dataType: "json",
        success: function (msg) {
            stdout += msg.stdout;
            stdout += exitMessage;
            outputEditor.setValue(stdout, -1);

        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!", -1);
        }
    });
    disableBtn();
}

function highlightLine(lineNum) {
    var actualLine = lineNum - 1;
    var action = new highlightLineChange(lineNum);
    sendActionOverEditor(action);

    var Range = ace.require("ace/range").Range;
    var range = new Range(actualLine, 0, actualLine, 144);
    marker = editor.session.addMarker(range, "warning", "fullLine");
}

function removeHighLightLine(markerLast) {
    var action = new removeHighlightLineChange(markerLast);
    sendActionOverEditor(action);
    editor.getSession().removeMarker(markerLast);
}

function disableBtn() {
    $("#stepInto").attr('disabled', "true");
    $("#stepOver").attr('disabled', "true");
    $("#continue").attr('disabled', "true");
    $("#exit").attr('disabled', "true");
}

function activeBtn() {
    $('#stepInto').removeAttr("disabled");
    $('#stepOver').removeAttr("disabled");
    $('#continue').removeAttr("disabled");
    $('#exit').removeAttr("disabled");
}
