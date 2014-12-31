/**
 * Created by YBH on 2014/12/28.
 */
var canvas = document.getElementById("whiteBoard");
var context = canvas.getContext("2d");


var draw = false;
var eraser = false;
var currentState = "pen";


function enableEraser(){
    currentState = "eraser";
}

function enablePen(){
    currentState = "pen";
}



function eraseAll(){
    context.clearRect(0,0,canvas.width,canvas.height);
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
 鼠标拖动监听，画线条
 */
canvas.addEventListener("mousemove",function(e){
    if(draw == true){
        context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        context.stroke();
    }
    else if(eraser == true){
        context.clearRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop,10,10);
    }
});

/*
 鼠标按下监听，设置为可以画图，并且把起点设置到当前位置
 */
canvas.addEventListener("mousedown",function(e){

    if(currentState == "pen"){
        draw = true;
        context.beginPath();
        context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }
    else if(currentState == "eraser"){
        eraser = true;
        context.clearRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop,10,10);
    }
    //draw = true;


});

/*
 松开鼠标监听，不能画图
 */
canvas.addEventListener("mouseup",function(e){
    draw = false;
    eraser = false;
});


