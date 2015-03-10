/**
 * Created by YBH on 2015/2/11.
 */
var penColor = "blue";
var penSize = 5;
var onDraw = false;

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


function addLine(x,y){

    var BrokenLineShape = require("zrender/shape/BrokenLine");
    var line = new BrokenLineShape({
        style : {
            pointList : [[x,y]],
            lineWidth : penSize,
            color:penColor
        },
        draggable:false
    });
    zr.addShape(line);
    currentLine = line;
    zr.render();
}

$("#graphBoard").bind("mousedown",function(e){
    if(currentState == states.pen){
        onDraw = true;
    }
});

$("#graphBoard").bind("mousemove",function(e){
    if((onDraw == true)&&(currentState == states.pen)){
        var xLoc = e.pageX - $("#graphBoard").offset().left;
        var yLoc = e.pageY - $("#graphBoard").offset().top;

        if(currentLine == null){
            addLine(xLoc,yLoc);
        }
        //console.log(xLoc + " " + yLoc);
        currentLine.style.pointList.push([xLoc,yLoc]);
        zr.render();
    }
});

$("#graphBoard").bind("mouseup",function(e){
    if(currentLine != null){
        addObjs(currentLine);
        var id = currentLine.id;
        addOpes(new Operation(id,"addShape"));
        currentLine = null;
    }
    onDraw = false;
});
