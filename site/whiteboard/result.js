/**
 * Created by YBH on 2014/12/28.
 */
var canvas = document.getElementById("whiteBoard");
var context = canvas.getContext("2d");

var text = "Canvas";
context.font = "20px arial";
context.fillStyle = "rgba(255,0,0,0.5)";
context.textAlign = "right";
context.textBaseline =
context.fillText(text,100,100);


context.storkeStyle = "rgba(0,255,0,0.5)";
context.textAlign = "left";
context.strokeText(text,100,200);

function f(a,b){
    return a+b;
}

var result = add(10, 20);

function add(){
    return arguments[0]+arguments[1];
}

