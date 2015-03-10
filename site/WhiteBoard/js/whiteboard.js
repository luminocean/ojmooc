/**
 * Created by YBH on 2015/1/13.
 */
var states = {
    free:"free",
    text:"text",
    pen:"pen",
    graph:"graph"
}

function Operation(id,operation,val,preVal){
    this.id = id;
    this.operation = operation;
    this.val = val;
    this.preVal = preVal;

}

var currentState = states.free;
var dbClickTimer = null;
var timer = 0;

var objs = new Array();
var opes = new Array();
var undoIndex = -1;
var haveUndo = false;
//var haveRedo = false;

//双击回到初始状态
$("#graphBoard").bind("dblclick",function(){
    clearTimeout(dbClickTimer);
    currentState = states.free;
});

//单击监听
$("#graphBoard").bind("click",function(e){
    clearTimeout(dbClickTimer);

    dbClickTimer = setTimeout(function(){
        var xLoc = e.pageX - $("#graphBoard").offset().left;
        var yLoc = e.pageY - $("#graphBoard").offset().top;

        switch(currentState){
            case states.text:         //文本模式，点击界面添加文本
                createText(e.pageX, e.pageY,xLoc,yLoc);
                break;
            //case states.pen:
            //    addLine(xLoc,yLoc);
            //    break;
        }
    },300);
});

$("#penButton").bind("click",function(e){
    changeToPenMode();
});


$("#penMenu").bind("click",function(e){
    var xLoc = $("#penButton").offset().left;
    var yLoc = $("#penButton").offset().top + $("#penButton").outerHeight(true);

    var penStyle = $.layer({
        type: 2,
        shade:[1],
        title: false,
        closeBtn:false,
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
        border:[0],
        offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
        area: ["400px","200px"],
        iframe: {src : "textStyle.html"}
    });
});

$("#imageButton").bind("mousedown",function(e){
    changeToGraphMode();
});

$("#imageMenu").bind("mousedown",function(e){
    var xLoc = $("#imageButton").offset().left;
    var yLoc = $("#imageButton").offset().top + $("#imageButton").outerHeight(true);

    var graphs = $.layer({
        type: 2,
        shade:[1],
        title: false,
        closeBtn:false,
        shadeClose:true,
        border:[0],
        offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
        area: ["220px","150px"],
        iframe: {src : "graphs.html"}
    });
});

//画笔键按下，开启画笔模式
$("#penButton").bind("mousedown",function(e){
    //changeToPenMode();
    console.log("penMode");
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
    currentState = states.text;
}

function changeToPenMode(){
    currentState = states.pen;
}

function changeToGraphMode(){
    currentState = states.graph;
}

function undo(){
    if(haveUndo == false){
        haveUndo = true;
        undoIndex = opes.length;
    }
    undoIndex--;
    if(undoIndex < 0){
        undoIndex = 0;
        return;
    }
    var ope = opes[undoIndex];
    switch(ope.operation){
        case "addShape":
            shapeInvisible(ope.id,true);
            break;
        case "shapeVisible":
            shapeInvisible(ope.id,ope.preVal[0]);
            undo();
            break;
        case "editText":
            changeText(ope.id,ope.preVal[0]);
            break;
        case "drag":
            changeLocation(ope.id,ope.preVal);
            break;
        case "resizeCircle":
            resizeCircleAndTriangle(ope.id,ope.preVal);
            break;
        case "resizeArray":
            resizeDataStructure(ope.id,ope.preVal);
            break;
        case "resizeIf":
            resizeGraph(ope.id,ope.preVal);
            break;
        case "resizeRectangle":
            resizeRecAndImg(ope.id,ope.preVal);
            break;
        case "editDataStructure":
            editDataStructure(ope.id,ope.preVal);
            break;
        case "editGraph":
            editGraph(ope.id,ope.preVal);
            break;
        default :
            break;
    }
    console.log(ope);
}

function redo(){
    if((haveUndo == false)||(undoIndex > opes.length-1)){
        return;
    }
    var ope = opes[undoIndex];
    switch (ope.operation){
        case "drag":
            changeLocation(ope.id,ope.val);
            break;
        case "editText":
            changeText(ope.id,ope.val[0]);
            break;
        case "shapeVisible":
            shapeInvisible(ope.id,ope.val[0]);
            break;
        case "addShape":
            shapeInvisible(ope.id,false);
            break;
        case "resizeCircle":
            resizeCircleAndTriangle(ope.id,ope.val);
            break;
        case "resizeArray":
            resizeDataStructure(ope.id,ope.val);
            break;
        case "resizeIf":
            resizeGraph(ope.id,ope.val);
            break;
        case "resizeRectangle":
            resizeRecAndImg(ope.id,ope.val);
            break;
        case "editDataStructure":
            editDataStructure(ope.id,ope.val);
            break;
        case "editGraph":
            editGraph(ope.id,ope.val);
        default :
            break;
    }
    undoIndex++;
}

function editGraph(id,val){
    zr.modShape(id, {style: {val: val}});
    zr.refresh();
}

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




function clear(){
    for(var i = 0; i < objs.length; i++){
        zr.delShape(objs[i]);
    }
    zr.render();
    objs = new Array();
    opes = new Array();
    haveUndo = false;
    //haveRedo = false;
    undoIndex = -1;

}

function addOpes(op){
    if(haveUndo == true){
        opes.splice(undoIndex,opes.length-undoIndex);
        haveUndo = false;
    }
    opes.push(op);
}

function addObjs(ob){
    objs.push(ob);
}


