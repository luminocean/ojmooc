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
    if (action.name == 'editorChange') {
        editor.setValue(action.value);
    }
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

function editorChange(action){
    editor.setValue(action.value);
}

function inputEditorChange(action){
    inputEditor.setValue(action.value);
}

function outputEditorChange(action){
    outputEditor.setValue(action.value);
}

var actions = ["editorChange","inputEditorChange","outputEditorChange"];
var actions_func = [editorChange,inputEditorChange,outputEditorChange];


var editorRecord = new editorRecord();