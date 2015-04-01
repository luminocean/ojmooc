function getPenColor(){
    return whiteboard.penColor;
}
function setPenColor(color){
    whiteboard.penColor = color;
    actionPerformed(new Action(0,"setPenColor",color));     //添加改变画笔颜色动作
}
function getPenSize(){
    return whiteboard.penSize;
}
function setPenSize(size){
    whiteboard.penSize = size;
    actionPerformed(new Action(0,"setPenSize",size));       //添加改变画笔粗细动作
}

//使用脚本，快速添加线段
function quickAddLine(id,pointList){
    var BrokenLineShape = require("zrender/shape/BrokenLine");
    var line = new BrokenLineShape({
        id:id,
        style : {
            pointList : pointList,
            lineWidth : whiteboard.penSize,
            color:whiteboard.penColor
        },
        draggable:false
    });
    zr.addShape(line);
    whiteboard.currentLine = line;
    zr.render();
    //添加对象和操作
    addObjs(whiteboard.currentLine);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"quickAddLine",pointList));              //使用脚本添加线段操作
}

//画笔状态下鼠标拖动后添加线段
function addLine(id,x,y){
    var BrokenLineShape = require("zrender/shape/BrokenLine");
    var line = new BrokenLineShape({
        id:id,
        style : {
            pointList : [[x,y]],
            lineWidth : whiteboard.penSize,
            color:whiteboard.penColor
        },
        draggable:false,
        hoverable:false
    });
    zr.addShape(line);
    whiteboard.currentLine = line;
    zr.render();

    addObjs(whiteboard.currentLine);
    var id = whiteboard.currentLine.id;
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addLine",[x,y]));       //鼠标拖动添加线段操作
}

//鼠标按下，设置当前模式
$("#graphBoard").bind("mousedown",function(e){
    if(whiteboard.currentState == states.pen){             //如果当前为画笔模式，设置能够画线
        whiteboard.currentLine = null;
        whiteboard.onDraw = true;
    }
});

//鼠标拖动，画线段
$("#graphBoard").bind("mousemove",function(e){
    if((whiteboard.onDraw == true)&&(whiteboard.currentState == states.pen)){
        var xLoc = e.pageX - $("#graphBoard").offset().left;
        var yLoc = e.pageY - $("#graphBoard").offset().top;

        if(whiteboard.currentLine == null){
            addLine(generateID(),xLoc,yLoc);
        }
        whiteboard.currentLine.style.pointList.push([xLoc,yLoc]);
        zr.render();

        actionPerformed(new Action(whiteboard.currentLine.id,"addLinePoint",[xLoc,yLoc]));            //画线动作
    }
});

//鼠标松开，保存操作和线段，用于撤销和回放
$("#graphBoard").bind("mouseup",function(e){
    whiteboard.onDraw = false;
});
