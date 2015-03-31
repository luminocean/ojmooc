/**
 * Created by savio on 2015/3/21.
 */
$(document).ready(function () {

    $("#leftPanel").hide();
    $("#rightPanel").hide();
    $("#debugBegin").hide();
    $("#debugOut").hide();

    ace.require("ace/ext/language_tools");
    var inputEditor = ace.edit("inputEditor");
    var outputEditor = ace.edit("outputEditor");
    var editor = ace.edit("editor");
    inputEditor.setTheme("ace/theme/twilight");
    outputEditor.setTheme("ace/theme/twilight");
    outputEditor.setReadOnly(true);

    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/c_cpp");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true  //自动补全代码
    });
});

$("#fontsize").change(function () {
    var size = $("#fontsize").val();
    $("#editor").css("font-size", size);

})

$("#language").change(function () {
    var editor = ace.edit("editor");
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

$("#run").click(function () {
    var editor = ace.edit("editor");
    var inputEditor = ace.edit("inputEditor");
    var outputEditor = ace.edit("outputEditor");

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

$("#debugInto").click(function () {
    $("#midPanel").removeClass("col-sm-10").addClass("col-sm-6");
    $("#leftPanel").show();
    $("#rightPanel").show();
    $("#debugBegin").show();
    $("#debugOut").show();
    $("#debugInto").hide();
    $("#run").hide();

    var editor = ace.edit("editor");
    var current_file = '';
    editor.on("guttermousedown", function(e){
        var target = e.domEvent.target;
        var row = e.getDocumentPosition().row;
        var editSession = ace.createEditSession("editor", "ace/mode/pascal");
        //alert(row);
        if (target.className.indexOf("ace_gutter-cell") == -1)
            return;
        if (!editor.isFocused())
            return;
        if (e.clientX > 25 + target.getBoundingClientRect().left)
            return;

        var breakpoints = e.editor.session.getBreakpoints();
        //alert(breakpoints.length);
        if (!breakpoints[row]) {
            e.editor.session.setBreakpoint(row);
            //debugger_ui.debugger.dbgBreakpointSet(debugger_ui.debugger.breakpoint_type.line, current_file, row + 1);
        } else {
            //alert(row);
            e.editor.session.clearBreakpoint(row);
            //Debugger.clearBreakpoint(current_file, row + 1);
        }
        e.stop();
    });

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
    var editor = ace.edit("editor");
    var inputEditor = ace.edit("inputEditor");
    var outputEditor = ace.edit("outputEditor");

    var code = editor.getValue();
    var lan = $("#language").val();
    var params = inputEditor.getValue().trim();

    $.ajax({
        type: "POST",
        url: "/editor/debugBegin",
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

$("#addVariableBtn").click(function(){
    var variableName = $("#variable-name").val();
    $("#addVariable").modal("hide");
    $("#variables").append("<tr><td>"+variableName+"</td><td>"+"undefined"+"</td></tr>");
});

$("#closeModalBtn").click(function(){
   $("#addVariable").modal("hide");
});
