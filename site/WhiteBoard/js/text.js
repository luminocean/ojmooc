var dbClickStartTime = new Date().getTime();

function getTextFont(){
    return whiteboard.textFont;
}
function getTextSize(){
    return whiteboard.textSize;
}
function getTextColor(){
    return whiteboard.textColor;
}
function setTextFont(font){
    whiteboard.textFont = font;
    actionPerformed(new Action(0,"setTextFont",font));     //添加改变字体动作
}
function setTextSize(size){
    whiteboard.textSize = size;
    actionPerformed(new Action(0,"setTextSize",size));     //添加改变字体大小动作
}
function setTextColor(color){
    whiteboard.textColor = color;
    actionPerformed(new Action(0,"setTextColor",color));     //添加改变文本颜色动作
}

//文本模式下点击白板，显示添加文本的文本框
function createText(xLoc,yLoc,x,y){
    var editText = $.layer({
        type: 1,
        title: false,
        offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
        area: ["170px","20px"],
        border: [0], //去掉默认边框
        shade: [0], //去掉遮罩
        closeBtn: [0, true],
        page: {
            html: '<div style="width:180px; height:20px;"><input id="textField" type="text"></div>'
        }
    });
    var textField = $("#textField");
    textField.bind("keydown",function(e){
        if(e.keyCode == 13){
            layer.close(editText);
            addText(generateID(),textField.val(),x,y);
            zr.render();
        }
    });
}


//添加文本
function addText(id,txt,x,y){
    var text = new Text({
        id:id,
        style: {
            text: txt,
            x: x,
            y: y,
            textFont: whiteboard.textSize+" "+whiteboard.textFont,
            color: whiteboard.textColor,
            preLocation:[x,y]
        },
        draggable:true
    });

    text.bind("dragend",Dragged);


    text.bind("mousedown",dbClicked);
    text.bind("mousedown",getLocation);
    text.drift = drift;
    zr.addShape(text);
    zr.render();

    addObjs(text);
    addOpes(new Operation(text.id,"addShape",[txt,x,y]));

    actionPerformed(new Action(text.id,"addText",[txt,x,y]));               //添加文本操作
}

//记录拖动之前的位置
function getLocation(params){
    params.target.style.preLocation[0] = params.target.style.x;
    params.target.style.preLocation[1] = params.target.style.y;
}

//文本双击监听，修改文本
function dbClicked(params){
    var textShape = params.target;                                                                  //获取文本对象

    var currentTime = new Date().getTime();                                                         //判断是否双击
    if((currentTime - dbClickStartTime) < 300){
        var event = require("zrender/tool/event");
        var yLoc = (event.getY(params.event)+graphBoard.offsetTop);
        var xLoc = (event.getX(params.event)+graphBoard.offsetLeft);

        var editText = $.layer({
            type: 1,
            title: false,
            offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
            area: ["170px","20px"],
            border: [0], //去掉默认边框
            shade: [0], //去掉遮罩
            closeBtn: [0, true],
            page: {
                html: '<div style="width:180px; height:20px;"><input id="textField" type="text"></div>'
            }
        });

        var textField = $("#textField");
        var preVal = textShape.style.text;
        textField.val(preVal);
        textField.bind("keydown",function(e){
            if(e.keyCode == 13){
                textShape.style.text = textField.val();
                layer.close(editText);
                zr.render();

                addOpes(new Operation(textShape.id,"editText",[textShape.style.text],[preVal]));

                actionPerformed(new Action(textShape.id,"editText",textShape.style.text));            //修改文本操作
            }
        });
    }
    dbClickStartTime = currentTime;
}