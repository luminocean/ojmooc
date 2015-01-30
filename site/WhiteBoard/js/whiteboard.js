/**
 * Created by YBH on 2015/1/13.
 */
var mainBoard = $("#mainBoard");
var graphBoard = $("#graphBoard");
var textButton = $("#textButton");
//var textStyle;

//文本按钮点击监听，添加文本
textButton.bind("mousedown",function(e){
    //changeToTextMode();
});

//文本按钮点击监听，显示修改文本样式
textButton.bind("mousedown",function(e){

    var xLoc = textButton.offset().left;
    var yLoc = textButton.offset().top + textButton.outerHeight(true);

    textStyle = $.layer({
        type: 2,
        shade:[1],
        title: false,
        closeBtn:false,
        shadeClose:true,
        border:[0],
        offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
        area: ["350px","140px"],
        iframe: {src : "textStyle.html"}
    });
});

//鼠标移出文本按钮监听，隐藏修改文本样式
textButton.bind("mouseleave",function(e){
    //layer.close(textStyle);
});

$("#imageButton").bind("mousedown",function(e){
    //changeToGraphMode();
});

//画笔键按下，开启画笔模式
$("#penButton").bind("mousedown",function(e){
    //changeToPenMode();
    console.log("penMode");
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


