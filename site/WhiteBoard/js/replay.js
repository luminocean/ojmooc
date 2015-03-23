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

    this.objs = scene;
}

function replayScene(scene){

}

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
    };
}
//鼠标拖动画线
function addLinePoint(id,val){
    console.log(val);
    whiteboard.currentLine.style.pointList.push(val);
    zr.render();
}



