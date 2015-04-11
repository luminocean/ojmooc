/**
 * Created by savio on 2015/3/21.
 */

var debugId;
var stdout = "";
var breakpoints = [];
var variables = [];
var exitMessage = "程序调试结束！\r\n";

var editor = ace.edit("editor");
var inputEditor = ace.edit("inputEditor");
var outputEditor = ace.edit("outputEditor");

//var Range = ace.require("ace/range").Range;
//var range = new Range(0, 0, 0, 0);
var marker;


$(document).ready(function () {
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

    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    disableBtn();
});

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
        //case "bas":
        //    session.setMode("ace/mode/qbasic");
        //    break;
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
            if (msg.err) {
                stdout += msg.err;
                outputEditor.setValue(stdout, -1);
                return;
            }
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
    $("#localsTb").empty();


    for (var bp in breakpoints) {
        bplines.push(bp);
    }
    console.log("breakpoints" + bplines);
    console.log("variables" + variables);

    $.ajax({
        type: "POST",
        url: "/play/editor/debugBegin",
        data: {code: code, language: lan, params: params, 'bps[]': bplines},
        dataType: "json",
        success: function (msg) {
            if (msg.err) {
                removeHighLightLine(marker);
                stdout += msg.err;
                console.log(msg.err);
                outputEditor.setValue(stdout, -1);
                return;
            }
            debugId = msg.debugId;
            stdout += message;
            stdout += msg.stdout;
            editor.setDebugId(debugId);

            outputEditor.setValue(stdout, -1);
            printLocals(msg.locals);

            if (msg.finish) {
                exitDebug(debugId);
                outputEditor.setValue(stdout, -1);
            } else {
                removeHighLightLine(marker);
                printVariables(variables);
                highlightLine(msg.breakPoint.lineNum);
            }
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!", -1);
        }
    });
});

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
});

function step(url, debugId) {
    $.ajax({
        type: "POST",
        url: url,
        data: {debugId: debugId},
        dataType: "json",
        success: function (msg) {
            stdout += msg.stdout;
            outputEditor.setValue(stdout, -1);

            if (msg.err) {
                removeHighLightLine(marker);
                stdout += msg.err;
                outputEditor.setValue(stdout, -1);
                return;
            }
            if (msg.finish) {
                exitDebug(debugId);
                outputEditor.setValue(stdout, -1);
            } else {
                removeHighLightLine(marker);
                printVariables(variables);
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
            if (msg.err) {
                stdout += msg.err;
                console.log(msg.err);
                outputEditor.setValue(stdout, -1);
                return;
            }
            stdout += exitMessage;
            outputEditor.setValue(stdout, -1);
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!", -1);
        }
    });
    disableBtn();
    $("#variablesTb").empty();
    for (var i = 0; i < variables.length; i++) {
        var variableInfo = $("<tr><td class='variName'>" + variables[i] + "</td>" +
        "<td>" + "undefined" + "</td>" +
        "<td><span class='glyphicon glyphicon-remove'></span></td></tr>");
        $("#variablesTb").append(variableInfo);

        variableInfo.find(".glyphicon-remove").on("click", function () {
            var variName = $(this).parent().parent().find(".variName").text();
            variables.splice(jQuery.inArray(variName, variables), 1);
            $(this).parent().parent().remove();
        });
    }
}

$("#addVariableBtn").click(function () {
    var variableName = $("#variable-name").val();
    var variableInfo = $("<tr><td class='variName'>" + variableName + "</td>" +
    "<td>" + "undefined" + "</td>" +
    "<td><span class='glyphicon glyphicon-remove'></span></td></tr>");
    $("#addVariable").modal("hide");
    $("#variablesTb").append(variableInfo);

    variableInfo.find(".glyphicon-remove").on("click", function () {
        var variName = $(this).parent().parent().find(".variName").text();
        variables.splice(jQuery.inArray(variName, variables), 1);
        $(this).parent().parent().remove();
    });
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
    if (variables.length == 0)return;
    $("#variablesTb").empty();
    var variableInfo;
    $.ajax({
        type: "POST",
        url: "/play/editor/printVariables",
        data: {debugId: debugId, 'variables[]': variables},
        success: function (msg) {
            if (msg.err) {
                stdout += msg.err;
                console.log(msg.err);
                outputEditor.setValue(stdout, -1);
                return;
            }
            console.log(msg);
            for (var key in msg) {
                variableInfo = $("<tr><td class='variName'>" + key + "</td>" +
                "<td>" + msg[key] + "</td>" +
                "<td><span class='glyphicon glyphicon-remove'></span></td></tr>");
                $("#variablesTb").append(variableInfo);

                variableInfo.find(".glyphicon-remove").on("click", function () {
                    var variName = $(this).parent().parent().find(".variName").text();
                    variables.splice(jQuery.inArray(variName, variables), 1);
                    $(this).parent().parent().remove();
                });
            }
        },
        error: function () {
            outputEditor.setValue("Error:can not connect to the server!", -1);
        }
    });
}

function highlightLine(lineNum) {
    console.log("breakpointNum" + lineNum);
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

$("#debugInto").click(function () {
    var action = new debugIntoChange();
    sendActionOverEditor(action);
    runToDebug();
    //$("#editor").resize();
});

$("#debugOut").click(function () {
    var action = new debugOutChange();
    sendActionOverEditor(action);
    debugToRun();
    //$("#editor").resize()
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