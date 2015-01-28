/**
 * Created by YBH on 2015/1/15.
 */
function changeToTextMode(){
    currentState = states.graph;
    graphBoardState = graphBoardStates.text;
    drawBoardState = drawBoardStates.free;
    $("#mainBoard").removeClass().addClass("txt");

    changeToGraphBoard();
}
//双击初始时间
var time;

//添加文本
function addText(){
    var shape = new Text({
        style: {
            text: "text",
            x: 100,
            y: 100,
            textFont: '14px Arial'
        },
        draggable:true
    });
    shape.bind("dragend",textDragged);

    time = new Date().getTime();
    shape.bind("mousedown",function(params){
        var currentTime = new Date().getTime();
        if((currentTime - time) < 250){
            console.log("db click");

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
                closeBtn: [0, true], //去掉默认关闭按钮
                page: {
                    html: '<div style="width:180px; height:20px;"><input id="textField" type="text"></div>'
                }
            });
            editText.success = function(layero){
                alert("a");
            };

            var textfield = document.getElementById("textField");
            textfield.value = shape.style.text;

            textfield.onkeydown = function(e){
                if(e.keyCode == 13){
                    shape.style.text = textfield.value;
                    layer.close(editText);
                    zr.render();
                }
            }
            //编辑文本
        }
        time = currentTime;
    });

    zr.addShape(shape);
    zr.render();

}


function textDragged(params){
    var event = require("zrender/tool/event");
    console.log(event.getX(params.event).toString()+"px");
    console.log(event.getY(params.event).toString()+"px");
    console.log(params.id);
}

function editText(){
    var currentTime = new Date().getTime();
    if((currentTime - time) < 250) {

        var event = require("zrender/tool/event");
        var yLoc = (event.getY(params.event)+graphBoard.offsetTop);
        var xLoc = (event.getX(params.event)+graphBoard.offsetLeft);
    }
    time = currentTime;
}