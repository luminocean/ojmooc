/**
 * Created by YBH on 2015/1/13.
 */
var states = {
    free:"free",
    text:"text",
    pen:"pen",
    graph:"graph"
}

function Operation(){

}

var currentState = states.free;
var dbClickTimer = null;
var timer = 0;

var whiteBoardSates = new Array();
var objects = new Array();
var operations = new Array();

//双击回到初始状态
$("#graphBoard").bind("dblclick",function(){
    clearTimeout(dbClickTimer);
    currentState = states.free;
});

//单击监听
$("#graphBoard").bind("click",function(e){
    clearTimeout(dbClickTimer);

    dbClickTimer = setTimeout(function(){
        var xLoc = e.pageX - $("#graphBoard").offset().left;
        var yLoc = e.pageY - $("#graphBoard").offset().top;

        switch(currentState){
            case states.text:         //文本模式，点击界面添加文本
                createText(e.pageX, e.pageY,xLoc,yLoc);
                break;
            case states.pen:
                addLine(xLoc,yLoc);
                break;
        }
    },300);
});

$("#penButton").bind("click",function(e){
    changeToPenMode();
});


$("#penMenu").bind("click",function(e){
    var xLoc = $("#penButton").offset().left;
    var yLoc = $("#penButton").offset().top + $("#penButton").outerHeight(true);

    var penStyle = $.layer({
        type: 2,
        shade:[1],
        title: false,
        closeBtn:false,
        shadeClose:true,
        border:[0],
        offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
        area: ["400px","200px"],
        iframe: {src : "penStyle.html"}
    });
})


//文本按钮点击监听，添加文本
$("#textButton").bind("click",function(e){
    changeToTextMode();
});

//文本按钮点击监听，显示修改文本样式
$("#textMenu").bind("click",function(e){
    var xLoc = $("#textButton").offset().left;
    var yLoc = $("#textButton").offset().top + $("#textButton").outerHeight(true);

    var textStyle = $.layer({
        type: 2,
        shade:[1],
        title: false,
        closeBtn:false,
        shadeClose:true,
        border:[0],
        offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
        area: ["400px","200px"],
        iframe: {src : "textStyle.html"}
    });
});

$("#imageButton").bind("mousedown",function(e){
    changeToGraphMode();
});

$("#imageMenu").bind("mousedown",function(e){
    var xLoc = $("#imageButton").offset().left;
    var yLoc = $("#imageButton").offset().top + $("#imageButton").outerHeight(true);

    var graphs = $.layer({
        type: 2,
        shade:[1],
        title: false,
        closeBtn:false,
        shadeClose:true,
        border:[0],
        offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
        area: ["250px","150px"],
        iframe: {src : "graphs.html"}
    });
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

function changeToTextMode(){
    currentState = states.text;
}

function changeToPenMode(){
    currentState = states.pen;
    newLine();
}

function changeToGraphMode(){
    currentState = states.graph;
}


