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
    whiteboard.penColor = scene.pencolor;;
    whiteboard.penSize = scene.pensize;
    whiteboard.textColor = scene.textcolor;
    whiteboard.textFont = scene.textfont;
    whiteboard.textSize = scene.textsize;

    for(var i = 0; i < whiteboard.objs.length; i++){
        zr.addShape(whiteboard.objs[i]);
    }
    zr.render();
}

function replayScene(scene){

}

//回放一个操作
function replayAction(action){
    switch (action.actionname){
        case "setPenColor":                        //设置画笔颜色
            setPenColor(action.val);
            break;
        case "setPenSize":                        //设置画笔粗细
            setPenSize(action.val);
            break;
        case "quickAddLine":                        //快速添加线段
            quickAddLine(action.id,action.val);
            break;
        case "addLine":                             //添加线段
            addLine(action.id,action.val[0],action.val[1]);
            break;
        case "addLinePoint":                        //鼠标拖动画线
            addLinePoint(action.id,[action.val[0],action.val[1]]);
            break;
        case "setTextFont":                        //设置字体
            setTextFont(action.val);
            break;
        case "setTextSize":                        //设置字体大小
            setTextSize(action.val);
            break;
        case "setTextColor":                      //设置文本颜色
            setTextColor(action.val);
            break;
        case "addText":                             //添加文本
            addText(action.id,action.val[0],action.val[1],action.val[2]);
            break;
        case "editText":                            //修改文本
            changeText(action.id,action.val);
            break;
        case "drag":                                //拖动图形
            changeLocation(action.id,action.val);
            break;
        case "addOperation":                       //添加do图形
            addOperation(action.id,action.val);
            break;
        case "addDoWhile":                          //添加dowhile图形
            addDoWhile(action.id,action.val);
            break;
        case "addWhile":                            //添加while图形
            addWhile(action.id,action.val);
            break;
        case "addIf":                               //添加if图形
            addIf(action.id,action.val);
            break;
        case "editGraph":                           //修改图形的值
            editGraph(action.id,action.val);
            break;
        case "addArray":                            //添加array图形
            addArray(action.id,action.val);
            break;
        case "addStack":                            //添加stack图形
            addStack(action.id,action.val);
            break;
        case "addQueue":                            //添加queue图形
            addQueue(action.id,action.val);
            break;
        case "editDataStructure":                   //修改数据结构
            editDataStructure(action.id,action.val);
            break;
        case "addCircle":                            //添加circle图形
            addCircle(action.id,action.val[0],action.val[1],action.val[2]);
            break;
        case "addSquare":                            //添加square图形
            addSquare(action.id,action.val[0],action.val[1],action.val[2]);
            break;
        case "addRectangle":                            //添加rectangle图形
            addRectangle(action.id,action.val[0],action.val[1],action.val[2],action.val[3]);
            break;
        case "addTriangle":                            //添加triangle图形
            addTriangle(action.id,action.val[0],action.val[1],action.val[2]);
            break;
        case "addImage":
            addImage(action.id,action.val[0],action.val[1],action.val[2]);
            break;
        case "resizeCircle":
            resizeCircleAndTriangle(action.id,action.val);
            break;
        case "resizeArray":
            resizeDataStructure(action.id,action.val);
            break;
        case "resizeIf":
            resizeGraph(action.id,action.val);
            break;
        case "resizeRectangle":
            resizeRecAndImg(action.id,action.val);
            break;
        case "shapeInvisible":
            shapeInvisible(action.id,action.val);
            break;

    };
}
//鼠标拖动画线
function addLinePoint(id,val){
    console.log(val);
    whiteboard.currentLine.style.pointList.push(val);
    zr.render();
}




