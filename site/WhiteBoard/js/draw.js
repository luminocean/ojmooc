/**
 * Created by YBH on 2015/1/13.
 */
var drawBoardStates = {
    free:"free",
    pen:"pen",
    eraser:"eraser"
}


var context = canvas[0].getContext("2d");
var width = canvas[0].width;
var height = canvas[0].height;
var eraserWidth = 24;
var penWidth = 0;
var drawBoardState = drawBoardStates.pen;
var onDraw = false;
var onErase = false;
var data = new Array();
var index = 0;
var haveUndo = false;
var haveRedo = false;

data.push(context.getImageData(0,0,width,height));


//鼠标按下时的监听，能够画图或者擦除，设置当前位置
canvas.bind("mousedown",function(e){
    if(currentState == states.draw){
        if(drawBoardState == drawBoardStates.pen){
            enableDraw();
            console.log("setondraw true");
            var xLoc = e.pageX - canvas[0].offsetLeft;
            var yLoc = e.pageY - canvas[0].offsetTop + penWidth;
            startLine(xLoc,yLoc);
            console.log("startLine" + xLoc + yLoc);
        }
        else if(drawBoardState == drawBoardStates.eraser){
            enableErase();
            console.log("setonerase true");
            var xLoc = e.pageX - canvas[0].offsetLeft;
            var yLoc = e.pageY - canvas[0].offsetTop;
            erase(xLoc,yLoc);
            console.log("erase" + xLoc + yLoc);
        }
    }
    else if(currentState == states.graph){

    }
});

//鼠标拖动，画图或者擦除
canvas.bind("mousemove",function(e){
    if(currentState == states.draw){
        if(onDraw){
            var xLoc = e.pageX - canvas[0].offsetLeft;
            var yLoc = e.pageY - canvas[0].offsetTop + penWidth;
            drawLine(xLoc,yLoc);
            console.log("drawline");
        }
        else if(onErase){
            var xLoc = e.pageX - canvas[0].offsetLeft;
            var yLoc = e.pageY - canvas[0].offsetTop;
            erase(xLoc,yLoc);
            console.log("erase" + xLoc + yLoc);
        }
    }
    else if(currentState == states.graph){

    }
});

//松开鼠标，不能画图和擦除
canvas.bind("mouseup",function(e){
    if(currentState == states.draw){
        disableDraw();
        console.log("setondraw false");
        disableErase();
        console.log("setonerase false");
        saveImageData();
        console.log("save image data");
    }
    else if(currentState == states.graph){

    }
});


//画笔模式
function changeToPenMode(){
    currentState = states.draw;
    drawBoardState = drawBoardStates.pen;
    graphBoardState = graphBoardStates.free;
    $("#mainBoard").removeClass().addClass("pen");

    changeToDrawBoard();
}

//橡皮模式
function changeToEraserMode(){
    currentState = states.draw;
    drawBoardState = drawBoardStates.eraser;
    graphBoardState = graphBoardStates.free;
    $("#mainBoard").removeClass().addClass("eraser");

    changeToDrawBoard();
}

function changeToDrawBoard(){
    $("#drawBoard")[0].style.zIndex = 2;
    $("#graphBoard")[0].style.zIndex = 1;
}

//撤销
function undo(){
    context.clearRect(0,0,width,height);
    if(haveUndo == false){
        haveUndo = true;
    }
    if(index > 0){
        index--;
        context.putImageData(data[index],0,0,0,0,width,height);
    }
}

//重做
function redo(){
    if(haveRedo == false){
        haveRedo = true;
    }
    if(index < (data.length-1)){
        index++;
        context.clearRect(0,0,width,height);
        context.putImageData(data[index],0,0,0,0,width,height);
    }
}

//清空
function clear(){
    context.clearRect(0,0,width,height);
    data = new Array();
    data.push(context.getImageData(0,0,width,height));
    index = 0;
}
//开启画笔
function enableDraw(){
    onDraw = true;
}
//关闭画笔
function disableDraw(){
    onDraw = false;
}
//开启橡皮
function enableErase(){
    onErase = true;
}
//关闭橡皮
function disableErase(){
    onErase = false;
}
//设置画笔起点，开始画线
function startLine(x,y){
    context.beginPath();
    context.moveTo(x, y);
}
//擦除一块区域，左上x,y，宽、高等于橡皮宽度
function erase(x,y){
    context.clearRect(x, y,eraserWidth,eraserWidth);
}
//画线，从之前位置画到x,y
function drawLine(x,y){
    context.lineTo(x, y);
    context.stroke();
}
//保存一次画线或者擦除后的canvas状态，用于撤销和重做
function saveImageData(){
    if(index < (data.length-1)){
        data.splice(index+1,data.length-(1+index));
    }
    data.push(context.getImageData(0,0,width,height));
    index = data.length-1;
    haveUndo = false;
    haveRedo = false;
}

//回放
function replay(){

}