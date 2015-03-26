var Scene = function(objs,pencolor,pensize,textfont,textcolor,textsize){
    this.objs = objs;
    this.pencolor = pencolor;
    this.pensize = pensize;
    this.textfont = textfont;
    this.textcolor = textcolor;
    this.textsize = textsize;
}
//获取某一时间白板的状态
WhiteBoard.prototype.getScene = function(){
    var scene = new Scene();
    scene.objs = whiteboard.objs;
    scene.pencolor = whiteboard.penColor;
    scene.pensize = whiteboard.penSize;
    scene.textcolor = whiteboard.textColor;
    scene.textfont = whiteboard.textFont;
    scene.textsize = whiteboard.textSize;

    return scene;
}

var onRecord = false;
var actions = new Array();
//点击开始录制，改变录制状态为true
$("#record").bind("click",function(){
    onRecord = true;
});
//点击结束录制，改变录制状态false
$("#stop").bind("click",function(){
    onRecord = false;
});

//出现新的操作，判断是否发送
function actionPerformed(action){
    if(onRecord == true){
        sendAction(action);
    }
}


function getActions(){
    return actions;
}

