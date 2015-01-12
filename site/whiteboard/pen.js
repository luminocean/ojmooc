/**
 * Created by YBH on 2014/12/28.
 */
var canvas = document.getElementById("whiteBoard");
var context = canvas.getContext("2d");


var data = new Array();
data.push(context.getImageData(0,0,500,500));
var index = 0;
var haveUndo = false;
var haveRedo = false;
var pen = false;
var eraser = false;
var currentState = "pen";


/*
启用橡皮
 */
function enableEraser(){
    currentState = "eraser";
}

/*
 启用画笔
 */
function enablePen(){
    currentState = "pen";
}

function eraseAll(){
    context.clearRect(0,0,canvas.width,canvas.height);

    data = new Array();
    data.push(context.getImageData(0,0,500,500));
    index = 0;
}

/*
设置颜色
 */
function setColor(color) {
    enablePen();
    context.strokeStyle = color;
}

/*
 设置线条宽度
 */
function setLineWidth(width){
    enablePen();
    context.lineWidth = width;
}

/*
撤销
 */
function undo(){
    context.clearRect(0,0,500,500);
    if(haveUndo == false){
        haveUndo = true;
    }
    if(index > 0){
        index--;
        console.log(index);
        context.putImageData(data[index],0,0,0,0,500,500);
    }
}

/*
重做
 */
function redo(){
    if(haveRedo == false){
        haveRedo = true;
    }
    if(index < (data.length-1)){
        index++;
        context.clearRect(0,0,500,500);
        context.putImageData(data[index],0,0,0,0,500,500);
    }
}

/*
 鼠标拖动监听，画线条
 */
canvas.addEventListener("mousemove",function(e){
    if(pen == true){
        context.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        context.stroke();
    }
    else if(eraser == true){
        context.clearRect(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop,10,10);
    }
});



/*
 鼠标按下监听，设置为可以画图，并且把起点设置到当前位置
 */
canvas.addEventListener("mousedown",function(e){

    console.log("!");

    if(currentState == "pen"){
        pen = true;
        context.beginPath();
        context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    }
    else if(currentState == "eraser"){
        eraser = true;
        context.clearRect(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop,10,10);
    }
});

/*
 松开鼠标监听，不能画图
 */
canvas.addEventListener("mouseup",function(e){
    pen = false;
    eraser = false;

    if(index < (data.length-1)){
        data.splice(index+1,data.length-(1+index));
    }
    data.push(context.getImageData(0,0,500,500));
    index = data.length-1;

    haveUndo = false;
    haveRedo = false;
});


