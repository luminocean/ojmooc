var states = {
    free:"free",
    text:"text",
    pen:"pen",
    graph:"graph"
}

var WhiteBoard = function(){
    this.currentState = states.free;                     //白板当前的状态

    this.objs = new Array();                //记录白板中的所有对象
    this.opes = new Array();                //记录能够撤销的操作
    this.undoIndex = -1;                    //记录撤销操作的index
    this.haveUndo = false;                 //是否撤销过

    this.penColor = "blue";          //画笔颜色
    this.penSize = 5;                 //粗细
    this.onDraw = false;             //是否能画
    this.currentLine = null;         //记录当前的线

    this.textFont = "Arial";        //文本字体
    this.textSize = "10px";         //文本大小
    this.textColor = "black";       //文本颜色
}

var whiteboard = new WhiteBoard();
var dbClickTimer = null;
var timer = 0;
var globalID = 0;

//撤销，重做时记录的操作
function Operation(id,operation,val,preVal){
    this.id = id;
    this.operation = operation;
    this.val = val;
    this.preVal = preVal;
}

//录制时记录的动作
function Action(id,actionname,val){
    this.id = id;
    this.actionname = actionname;
    this.val = val;
}

//双击回到初始状态
$("#graphBoard").bind("dblclick",function(){
    clearTimeout(dbClickTimer);
    whiteboard.currentState = states.free;
});

//单击监听，添加文本
$("#graphBoard").bind("click",function(e){
    clearTimeout(dbClickTimer);

    dbClickTimer = setTimeout(function(){
        var xLoc = e.pageX - $("#graphBoard").offset().left;
        var yLoc = e.pageY - $("#graphBoard").offset().top;

        switch(whiteboard.currentState){
            case states.text:         //文本模式，点击界面添加文本
                createText(e.pageX, e.pageY,xLoc,yLoc);
                break;
            //case states.pen:
            //    addLine(xLoc,yLoc);
            //    break;
        }
    },300);
});

//点击画笔按钮，转换到画笔模式
$("#penButton").bind("click",function(e){
    changeToPenMode();
});

//显示画笔菜单，修改画笔属性，颜色，粗细
$("#penMenu").bind("click",function(e){
    var xLoc = $("#penButton").offset().left;
    var yLoc = $("#penButton").offset().top + $("#penButton").outerHeight(true);

    var penStyle = $.layer({
        type: 2,
        shade:[1],
        title: false,
        closeBtn:false,
        fix:false,
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
        fix:false,
        border:[0],
        offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
        area: ["400px","200px"],
        iframe: {src : "textStyle.html"}
    });
});

//切换到图形模式
$("#imageButton").bind("mousedown",function(e){
    changeToGraphMode();
});

//显示图形菜单，多种图形
$("#imageMenu").bind("mousedown",function(e){
    var xLoc = $("#imageButton").offset().left;
    var yLoc = $("#imageButton").offset().top + $("#imageButton").outerHeight(true);

    var graphs = $.layer({
        type: 2,
        shade:[1],
        title: false,
        closeBtn:false,
        fix:false,
        shadeClose:true,
        border:[0],
        offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
        area: ["220px","150px"],
        iframe: {src : "graphs.html"}
    });
});

//撤销键按下，撤销
$("#undoButton").bind("mousedown",function(e){
    undo();
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
    whiteboard.currentState = states.text;
}

function changeToPenMode(){
    whiteboard.currentState = states.pen;
}

function changeToGraphMode(){
    whiteboard.currentState = states.graph;
}

//撤销
function undo(){
    if(whiteboard.haveUndo == false){
        whiteboard.haveUndo = true;
        whiteboard.undoIndex = whiteboard.opes.length;
    }
    whiteboard.undoIndex--;
    if(whiteboard.undoIndex < 0){
        whiteboard.undoIndex = 0;
        return;
    }
    var ope = whiteboard.opes[whiteboard.undoIndex];
    console.log(ope);
    switch(ope.operation){
        case "addShape":
            shapeInvisible(ope.id,true);
            actionPerformed(new Action(ope.id,"shapeInvisible",true));
            break;
        case "shapeVisible":
            shapeInvisible(ope.id,ope.preVal[0]);
            actionPerformed(new Action(ope.id,"shapeInvisible",ope.preVal[0]));
            break;
        case "editText":
            changeText(ope.id,ope.preVal[0]);
            actionPerformed(new Action(ope.id,"editText",ope.preVal[0]));
            break;
        case "drag":
            changeLocation(ope.id,ope.preVal);
            actionPerformed(new Action(ope.id,"drag",ope.preVal));
            break;
        case "resizeCircle":
            resizeCircleAndTriangle(ope.id,ope.preVal);
            actionPerformed(new Action(ope.id,"resizeCircle",ope.preVal));
            break;
        case "resizeArray":
            resizeDataStructure(ope.id,ope.preVal);
            actionPerformed(new Action(ope.id,"resizeArray",ope.preVal));
            break;
        case "resizeIf":
            resizeGraph(ope.id,ope.preVal);
            actionPerformed(new Action(ope.id,"resizeIf",ope.preVal));
            break;
        case "resizeRectangle":
            resizeRecAndImg(ope.id,ope.preVal);
            actionPerformed(new Action(ope.id,"resizeRectangle",ope.preVal));
            break;
        case "editDataStructure":
            editDataStructure(ope.id,ope.preVal);
            actionPerformed(new Action(ope.id,"editDataStructure",ope.preVal));
            break;
        case "editGraph":
            editGraph(ope.id,ope.preVal);
            actionPerformed(new Action(ope.id,"editGraph",ope.preVal));
            break;
        default :
            break;
    }

}

//重做
function redo(){
    if((whiteboard.haveUndo == false)||(whiteboard.undoIndex > whiteboard.opes.length-1)){
        return;
    }
    var ope = whiteboard.opes[whiteboard.undoIndex];
    switch (ope.operation){
        case "drag":
            changeLocation(ope.id,ope.val);
            actionPerformed(new Action(ope.id,"drag",ope.val));
            break;
        case "editText":
            changeText(ope.id,ope.val[0]);
            actionPerformed(new Action(ope.id,"editText",ope.val[0]));
            break;
        case "shapeVisible":
            shapeInvisible(ope.id,ope.val[0]);
            actionPerformed(new Action(ope.id,"shapeVisible",ope.val[0]));
            break;
        case "addShape":
            shapeInvisible(ope.id,false);
            actionPerformed(new Action(ope.id,"shapeVisible",false));
            break;
        case "resizeCircle":
            resizeCircleAndTriangle(ope.id,ope.val);
            actionPerformed(new Action(ope.id,"resizeCircle",ope.val));
            break;
        case "resizeArray":
            resizeDataStructure(ope.id,ope.val);
            actionPerformed(new Action(ope.id,"resizeArray",ope.val));
            break;
        case "resizeIf":
            resizeGraph(ope.id,ope.val);
            actionPerformed(new Action(ope.id,"resizeIf",ope.val));
            break;
        case "resizeRectangle":
            resizeRecAndImg(ope.id,ope.val);
            actionPerformed(new Action(ope.id,"resizeRectangle",ope.val));
            break;
        case "editDataStructure":
            editDataStructure(ope.id,ope.val);
            actionPerformed(new Action(ope.id,"editDataStructure",ope.val));
            break;
        case "editGraph":
            editGraph(ope.id,ope.val);
            actionPerformed(new Action(ope.id,"editGraph",ope.val));
        default :
            break;
    }
    whiteboard.undoIndex++;
}

//修改图形的值
function editGraph(id,val){
    zr.modShape(id, {style: {val: val}});
    zr.refresh();
}

//修改数据结构的值
function editDataStructure(id,val){
    zr.modShape(id, {style: {n:val.length,val: val}});
    zr.refresh();
}

//修改圆，三角的大小
function resizeCircleAndTriangle(id,val){
    zr.modShape(id, {style: {r: val}});
    zr.refresh();
}

//修改数组，栈，队列的大小
function resizeDataStructure(id,val){
    zr.modShape(id, {style: {width: val}});
    zr.refresh();
}

//修改if,while,dowhile的大小
function resizeGraph(id,val){
    zr.modShape(id, {style: {length: val}});
    zr.refresh();
}

//修改长方形，图片的大小
function resizeRecAndImg(id,val){
    zr.modShape(id, {style: {width: val[0],height:val[1]}});
    zr.refresh();
}

//修改位置，用于拖动
function changeLocation(id,val){
    zr.modShape(id, {style: {x: val[0], y:val[1]}});
    zr.refresh();
}
//修改文本
function changeText(id,val){
    zr.modShape(id, {style: {text:val}});
    zr.refresh();
}
//修改能否看见，用于删除
function shapeInvisible(id,val){
    zr.modShape(id, {ignore:val});
    zr.refresh();
}

//清空
function clear(){
    console.log(whiteboard.objs.length);
    for(var i = 0; i < whiteboard.objs.length; i++){
        zr.delShape(whiteboard.objs[i]);
    }
    zr.render();
    whiteboard.objs = new Array();
    whiteboard.opes = new Array();
    whiteboard.haveUndo = false;

    whiteboard.undoIndex = -1;

    whiteboard.penColor = "blue";
    whiteboard.penSize = 5;
    whiteboard.onDraw = false;
    whiteboard.currentLine = null;

    whiteboard.textFont = "Arial";
    whiteboard.textSize = "10px";
    whiteboard.textColor = "black";
}

//添加操作
function addOpes(op){
    if(whiteboard.haveUndo == true){
        whiteboard.opes.splice(whiteboard.undoIndex,whiteboard.opes.length-whiteboard.undoIndex);
        whiteboard.haveUndo = false;
    }
    whiteboard.opes.push(op);
}

//添加图形对象
function addObjs(ob){
    whiteboard.objs.push(ob);
}

function generateID(){
    globalID++;
    return globalID;
}



