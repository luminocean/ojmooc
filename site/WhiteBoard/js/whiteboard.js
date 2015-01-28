/**
 * Created by YBH on 2015/1/13.
 */
//白板的两种模式，画笔，图片和文本
var states = {
    free:"free",
    draw:"draw",
    graph:"graph"
}


var currentState = states.draw;
var mainBoard = $("#mainBoard");
var canvas = $("#drawBoard");
var graphBoard = $("#graphBoard");




$("#textButton").bind("mousedown",function(e){
    changeToTextMode();
});

$("#imageButton").bind("mousedown",function(e){
    changeToGraphMode();
});

//画笔键按下，开启画笔模式
$("#penButton").bind("mousedown",function(e){
    changeToPenMode();
    console.log("penMode");
});

//橡皮键按下，开启橡皮模式
$("#eraserButton").bind("mousedown",function(e){
    changeToEraserMode();
    console.log("eraserMode");
});

//撤销键按下，撤销
$("#undoButton").bind("mousedown",function(e){
    undo();
    console.log("undo");
});

//重做键按下，重做
$("#redoButton").bind("mousedown",function(e){
    redo();
    console.log("redo");
});

//清空键按下，清空
$("#clearButton").bind("mousedown",function(e){
    clear();
    console.log("clear");
});


