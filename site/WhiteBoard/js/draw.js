/**
 * Created by YBH on 2015/2/11.
 */
var penColor = "blue";
var penSize = 5;

var currentLine = null;

function getPenColor(){
    return penColor;
}

function setPenColor(color){
    penColor = color;
}

function getPenSize(){
    return penSize;
}

function setPenSize(size){
    penSize = size;
}

function newLine(){
    currentLine = null;
}

function addLine(x,y){
    if(currentLine == null){
        var BrokenLineShape = require("zrender/shape/BrokenLine");
        var line = new BrokenLineShape({
            style : {
                pointList : [[x,y],[x+2,y+2]],
                lineWidth : penSize,
                color:penColor
            },
            draggable:true
        });
        zr.addShape(line);
        currentLine = line;
    }
    else{
        currentLine.style.pointList.push([x,y]);
    }
    zr.render();
}


function quickAddLine(pointList){
    var BrokenLineShape = require("zrender/shape/BrokenLine");
    var line = new BrokenLineShape({
        style : {
            pointList : pointList,
            lineWidth : penSize,
            color:penColor
        },
        draggable:true
    });
    zr.addShape(line);
    zr.render();
}
