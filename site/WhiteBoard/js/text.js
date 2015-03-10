/**
 * Created by YBH on 2015/1/15.
 */
//双击初始时间
var dbClickStartTime;
var textFont = "Arial";
var textSize = "10px";
var textColor = "black";

function getTextFont(){
    return textFont;
}
function getTextSize(){
    return textSize;
}
function getTextColor(){
    return textColor;
}
//设置字体类型
function setTextFont(font){
    textFont = font;
}
//设置字体大小
function setTextSize(size){
    textSize = size;
}
//设置字体颜色
function setTextColor(color){
    textColor = color;
}

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
            addText(textField.val(),x,y);
            zr.render();
        }
    });

}


//添加文本
function addText(txt,x,y){
    var text = new Text({
        style: {
            text: txt,
            x: x,
            y: y,
            textFont: textSize+" "+textFont,
            color: textColor,
            preLocation:[x,y]
        },
        draggable:true
    });

    text.bind("dragend",Dragged);

    dbClickStartTime = new Date().getTime();
    text.bind("mousedown",dbClicked);
    text.bind("mousedown",getLocation);
    text.drift = drift;
    zr.addShape(text);
    zr.render();
    addObjs(text);
    addOpes(new Operation(text.id,"addText",[txt,x,y]));
    //objs.push(text);
    //opes.push(new Operation(text.id,"addText",[txt,x,y]));
    //haveUndo = false;
}

function getLocation(params){
    params.target.style.preLocation[0] = params.target.style.x;
    params.target.style.preLocation[1] = params.target.style.y;
}

//文本拖动监听，记录位置
function textDragged(params){
    var event = require("zrender/tool/event");
    var xLoc = event.getX(params.event);
    var yLoc = event.getY(params.event);
    console.log("text dragged" + xLoc + yLoc);
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
                //opes.push(new Operation(textShape.id,"editText",[textShape.style.text],[preVal]));
                addOpes(new Operation(textShape.id,"editText",[textShape.style.text],[preVal]));
            }
        });
        console.log("edit text");
    }
    dbClickStartTime = currentTime;
}