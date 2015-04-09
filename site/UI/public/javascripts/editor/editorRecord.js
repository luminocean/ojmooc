/**
 * Created by savio on 2015/4/2.
 */


var editorRecord = function () {
    this.state = null;
    this.name = "editorRecord";
};

var Scene = function (debugStatus, srcCode, srcType, inputEditor, outputEditor, variables, breakpoints, locals) {
    this.debugStatus = status;
    this.srcCode = srcCode;
    this.srcType = srcType;
    this.inputEditor = inputEditor;
    this.outputEditor = outputEditor;
    this.variables = variables;
    this.breakpoints = breakpoints;
    this.locals = locals;
};

editorRecord.prototype.setAction = function (action) {
    console.log(action);
    setactionsFunc(action);
};

editorRecord.prototype.setScene = function () {

};

editorRecord.prototype.getScene = function () {
    return editor.getValue();
};

//定义不同类型的action
var editorChange = function (content) {
    this.name = "editorChange";
    this.value = content;
};

var inputEditorChange = function (content) {
    this.name = "inputEditorChange";
    this.value = content;
}

var outputEditorChange = function (content) {
    this.name = "outputEditorChange";
    this.value = content;
}

var fontChange = function(content){
    this.name = "fontChange";
    this.value = content;
}

var languageChange = function(content){
    this.name = "languageChange";
    this.value = content;
}

var debugIntoChange = function(){
    this.name = "debugIntoChange";
}

var debugOutChange = function(){
    this.name = "debugOutChange";
}

var setBreakpointChange = function(content){
    this.name = "setBreakpointChange";
    this.value = content;
}

var clearBreakpointChange = function(content){
    this.name = "clearBreakpointChange";
    this.value = content;
}

var variablesChange = function(content){
    this.name = "variablesChange";
    this.value = content;
}

var localsChange = function(content){
    this.name = "localsChange";
    this.value = content;
}

var selectionChange = function(content){
    this.name = "selectionChange";
    this.value = content;
}

var highlightLineChange = function(content){
    this.name = "highlightLineChange";
    this.value = content;
}

var removeHighlightLineChange = function(content){
    this.name = "removeHighlightLineChange";
    this.value = content;
}
//设置事件的监听
editor.on("change", function () {
    if(onRecord) {
        var value = editor.getValue();
        var action = new editorChange(value);
        //console.log(action.value);
        sendEditorAction(action);
    }
});

inputEditor.on("change", function () {
    if(onRecord) {
        var value = inputEditor.getValue();
        var action = new inputEditorChange(value);
        sendEditorAction(action);
    }
});

outputEditor.on("change", function () {
    if(onRecord) {
        var value = outputEditor.getValue();
        var action = new outputEditorChange(value);
        sendEditorAction(action);
    }
});

function editorChange_op(action){
    editor.setValue(action.value,-1);
}

function inputEditorChange_op(action){
    inputEditor.setValue(action.value,-1);
}

function outputEditorChange_op(action){
    outputEditor.setValue(action.value,-1);
}

function fontChange_op(action){
    $("#fontsize").val(action.value);
    $("#editor").css("font-size", action.value);
}

function languageChange_op(action){
    $("language").val(action.value);

    var lan = action.value;
    var session = editor.getSession();

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
}

function selectionChange_op(action){
    editor.getSession().selection.setSelectionRange(action.value,true);
}

function highlightLineChange_op(action){
    highlightLine(action.value);
}

function removeHighlightLineChange_op(action){
    removeHighLightLine(marker);
}

function debugIntoChange_op(action){
    runToDebug();
}

function debugOutChange_op(action){
    debugToRun();
}

function setBreakpointChange_op(action){
    editor.session.setBreakpoint(action.value);
}

function clearBreakpointChange_op(action){
    editor.session.clearBreakpoint(action.value);
}

function variablesChange_op(action){
    printVariables(action.value);
}

function localsChange_op(action){
    printLocals(action.value);
}
var runActions = ["editorChange","inputEditorChange","outputEditorChange","fontChange","languageChange","selectionChange"];
var runActions_func = [editorChange_op,inputEditorChange_op,outputEditorChange_op,fontChange_op,languageChange_op,selectionChange_op];

var debugActions = ["debugIntoChange","debugOutChange","setBreakpointChange","clearBreakpointChange","variablesChange","localsChange","highlightLineChange","removeHighlightLineChange"];
var debugActions_func = [debugIntoChange_op,debugOutChange_op,setBreakpointChange_op,clearBreakpointChange_op,variablesChange_op,localsChange_op,highlightLineChange_op,removeHighlightLineChange_op];

function setactionsFunc(action){
    var i = runActions.indexOf(action.name);
    var j = debugActions.indexOf(action.name);
    if(i>-1){
        runActions_func[i](action);
    }else if(j>-1){
        debugActions_func[j](action);
    }

}

function sendActionOverEditor(action){
    if(onRecord){
        sendEditorAction(action);
    }
}

var editorRecord = new editorRecord();