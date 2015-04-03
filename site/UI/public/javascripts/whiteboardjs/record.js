var WhiteBoardScene = function(objs,pencolor,pensize,textfont,textcolor,textsize){
    this.objs = [];
    for(var i = 0; i < objs.length; i++){
        this.objs[i] = objs[i];
    }
    this.pencolor = pencolor;
    this.pensize = pensize;
    this.textfont = textfont;
    this.textcolor = textcolor;
    this.textsize = textsize;
}

//获取某一时间白板的状态
WhiteBoard.prototype.getScene = function(){
    var scene = new WhiteBoardScene(whiteboard.objs,whiteboard.penColor,whiteboard.pensize,whiteboard.textFont,whiteboard.textColor,whiteboard.textSize);
    return scene;
}

var onRecord = false;
var actions = new Array();
//点击开始录制，改变录制状态为true
$("#startRecord").bind("click",function(){
    onRecord = true;
});
//点击结束录制，改变录制状态false
$("#stopRecord").bind("click",function(){
    onRecord = false;
});

//出现新的操作，判断是否发送
function actionPerformed(action){
    if(onRecord == true){
        sendAction(action);
    }
}

//F帧，发送当前所有对象的状态
function sendCurrentWhiteBoardState(){
    //传送objs数组
}

//P帧，发送当前的一个操作
function sendAction(action){
    //发送action
    actions.push(action);
    console.log(action);
}

function getActions(){
    return actions;
}

