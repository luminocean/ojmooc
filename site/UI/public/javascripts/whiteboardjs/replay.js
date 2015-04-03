$("#replay").bind("click",function(e){
    clear();
    var i = 0;
    var rep = setInterval(function(){
        if(i < actions.length){
            replayAction(actions[i]);
            i++;
        }
        else{
            clearInterval(rep);
        }
    },100);
});

//回放操作
WhiteBoard.prototype.setAction = function(action){
    replayAction(action);
}

//设置白板图形状态
WhiteBoard.prototype.setScene = function(scene){
    clear();
    whiteboard.objs = scene.objs;
    whiteboard.penColor = scene.pencolor;
    whiteboard.penSize = scene.pensize;
    whiteboard.textColor = scene.textcolor;
    whiteboard.textFont = scene.textfont;
    whiteboard.textSize = scene.textsize;

    for(var i = 0; i < whiteboard.objs.length; i++){
        zr.addShape(whiteboard.objs[i]);
    }
    zr.render();
}

function replay_setPenColor(action){
    setPenColor(action.val[0]);
}

function replay_setPenSize(action){
    setPenSize(action.val[0]);
}

function replay_quickAddLine(action){
    quickAddLine(action.id,action.val);
}

function replay_addLine(action){
    addLine(action.id,action.val[0],action.val[1]);
}

function replay_addLinePoint(action){
    addLinePoint(action.id,[action.val[0],action.val[1]]);
}

function replay_setTextFont(action){
    setTextFont(action.val[0]);
}

function replay_setTextSize(action){
    setTextSize(action.val[0]);
}

function replay_setTextColor(action){
    setTextColor(action.val[0]);
}

function replay_addText(action){
    addText(action.id,action.val[0],action.val[1],action.val[2]);
}

function replay_editText(action){
    changeText(action.id,action.val[0]);
}

function replay_drag(action){
    changeLocation(action.id,action.val);
}

function replay_addOperation(action){
    addOperation(action.id,action.val);
}

function replay_addDoWhile(action){
    addDoWhile(action.id,action.val);
}

function replay_addWhile(action){
    addWhile(action.id,action.val);
}

function replay_addIf(action){
    addIf(action.id,action.val);
}

function replay_editGraph(action){
    editGraph(action.id,action.val);
}

function replay_addArray(action){
    addArray(action.id,action.val);
}

function replay_addStack(action){
    addStack(action.id,action.val);
}

function replay_addQueue(action){
    addQueue(action.id,action.val);
}

function replay_editDataStructure(action){
    editDataStructure(action.id,action.val);
}

function replay_addCircle(action){
    addCircle(action.id,action.val[0],action.val[1],action.val[2],action.val[3]);
}

function replay_addSquare(action){
    addSquare(action.id,action.val[0],action.val[1],action.val[2],action.val[3]);
}

function replay_addRectangle(action){
    addRectangle(action.id,action.val[0],action.val[1],action.val[2],action.val[3],action.val[4]);
}

function replay_addTriangle(action){
    addTriangle(action.id,action.val[0],action.val[1],action.val[2],action.val[3]);
}

function replay_addImage(action){
    var imgid = action.val[0];
    var img = new Image();

    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:1337/download";
    xhr.open("POST",url,true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var imgdata = xhr.response;
            var suffix = imgid.split(".")[1];
            img.src = 'data:image/'+suffix +';base64,' + imgdata;
            addImage(action.id,img,action.val[1],action.val[2]);
        }
    }
    xhr.send(imgid);
}

function replay_resizeCircleAndTriangle(action){
    resizeCircleAndTriangle(action.id,action.val[0]);
}

function replay_resizeDataStructure(action){
    resizeDataStructure(action.id,action.val[0]);
}

function replay_resizeGraph(action){
    resizeGraph(action.id,action.val[0]);
}

function replay_resizeRecAndImg(action){
    resizeRecAndImg(action.id,action.val[0]);
}

function replay_shapeInvisible(action){
    shapeInvisible(action.id,action.val[0]);
}

var replay_operationList = ["setPenColor","setPenSize","quickAddLine","addLine","addLinePoint","setTextFont","setTextSize","setTextColor","addText","editText","drag","addOperation","addDoWhile","addWhile","addIf","editGraph","addArray","addQueue","editDataStructure","addCircle","addSquare","addRectangle","addTriangle","addImage","resizeCircle","resizeArray","resizeIf","resizeRectangle","shapeInvisible"];
var replay_funcs = [replay_setPenColor,replay_setPenSize,replay_quickAddLine,replay_addLine,replay_addLinePoint,replay_setTextFont,replay_setTextSize,replay_setTextColor,replay_addText,replay_editText,replay_drag,replay_addOperation,replay_addDoWhile,replay_addWhile,replay_addIf,replay_editGraph,replay_addArray,replay_addQueue,replay_editDataStructure,replay_addCircle,replay_addSquare,replay_addRectangle,replay_addTriangle,replay_addImage,replay_resizeCircleAndTriangle,replay_resizeDataStructure,replay_resizeGraph,replay_resizeRecAndImg,replay_shapeInvisible];

//回放一个操作
function replayAction(action){
    var i = replay_operationList.indexOf(action.actionname);
    replay_funcs[i](action);
}
//鼠标拖动画线
function addLinePoint(id,val){
    whiteboard.currentLine.style.pointList.push(val);
    zr.render();
}