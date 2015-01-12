/**
 * Created by YBH on 2014/12/31.
 */
//var canvas = document.getElementById("whiteBoard");
//var context = canvas.getContext("2d");

var zr; // 全局可用zrender对象
var picture = document.getElementById('main');
var textButton = document.getElementById("text");
var circleButton = document.getElementById("circle");


//require配置
require.config({
   packages: [
      {
         name: 'zrender',
         location: './zrender/src',
         main: 'zrender'
      }
   ]
});


require(
    [
       "zrender",
       "zrender/shape/Text",
        "zrender/shape/Circle",
        "zrender/tool/event",
        "zrender/shape/Base"
    ],
    function (zrender) {
        zr = zrender.init(picture);
        textButton.addEventListener("mousedown",addText);
        circleButton.addEventListener("mousedown",addCircle);

        addText();
        addCircle();
        addArray();
        addStack();
        addQueue();

        zr.render();
    }
);


function addArray(){
    var Base = require('zrender/shape/Base');
    function MyArray(options) {
        Base.call(this, options);
    }
    MyArray.prototype = {
        type : "array",
        brush : function(ctx, isHighlight) {
            var style = this.style || {};
            var x = style.x;
            var y = style.y;
            var n = style.n;
            var recWidth = style.width;
            for(var i = 0; i < n; i++){
                var xPos = x + i * recWidth;
                var yPos = y;
                ctx.strokeRect(xPos,yPos,recWidth,recWidth);
                ctx.strokeText(i,xPos+recWidth/2,yPos+recWidth+10);
            }
            return;
        },

        drift : function(dx, dy) {
            this.style.x += dx;
            this.style.y += dy;
        },

        isCover : function(x, y) {
            var originPos = this.getTansform(x, y);
            x = originPos[0];
            y = originPos[1];

            if (x >= (this.style.x)
                && x <= (this.style.x + this.style.width*this.style.n)
                && y >= this.style.y
                && y <= (this.style.y + this.style.width)
            ) {
                return true;
            }
            return false;
        }
    }

    require("zrender/tool/util").inherits(MyArray, Base);
    zr.addShape(new MyArray({
        style : {
            x : 200,
            y : 100,
            width:40,
            n:7,
            color : '#1e90ff',
            lineWidth : 1,
            text : 'array'
        },
        draggable : true
    }));

    zr.render();
}


function addQueue(){
    var Base = require('zrender/shape/Base');
    function MyQueue(options) {
        Base.call(this, options);
    }
    MyQueue.prototype = {
        type : "queue",
        brush : function(ctx, isHighlight) {
            var style = this.style || {};
            var x = style.x;
            var y = style.y;
            var n = style.n;
            var recWidth = style.width;

            ctx.beginPath();
            ctx.moveTo(x+recWidth*n,y);
            ctx.lineTo(x+recWidth*n + recWidth*2,y);
            ctx.moveTo(x+recWidth*n,y+recWidth);
            ctx.lineTo(x+recWidth*n + recWidth*2,y+recWidth);
            ctx.stroke();

            for(var i = 0; i < n; i++){
                var xPos = x + i * recWidth;
                var yPos = y;
                ctx.strokeRect(xPos,yPos,recWidth,recWidth);
                //ctx.strokeText(i,xPos+recWidth/2,yPos+recWidth+10);
            }
            ctx.strokeText("front",x,y+recWidth+10);
            ctx.strokeText("back",x+recWidth*n,y+recWidth+10);
            return;
        },

        drift : function(dx, dy) {
            this.style.x += dx;
            this.style.y += dy;
        },

        isCover : function(x, y) {
            var originPos = this.getTansform(x, y);
            x = originPos[0];
            y = originPos[1];

            if (x >= (this.style.x)
                && x <= (this.style.x + this.style.width*this.style.n)
                && y >= this.style.y
                && y <= (this.style.y + this.style.width)
            ) {
                return true;
            }
            return false;
        }
    }

    require("zrender/tool/util").inherits(MyQueue, Base);
    zr.addShape(new MyQueue({
        style : {
            x : 200,
            y : 400,
            width:40,
            n:5,
            color : '#1e90ff',
            lineWidth : 1,
            text : 'array'
        },
        draggable : true
    }));

    zr.render();
}


function addStack(){
    var Base = require('zrender/shape/Base');
    function MyStack(options) {
        Base.call(this, options);
    }
    MyStack.prototype = {
        type : "stack",
        brush : function(ctx, isHighlight) {
            var style = this.style || {};
            var x = style.x;
            var y = style.y;
            var n = style.n;
            var recWidth = style.width*2;
            var recHeight = style.width;

            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x,y-recWidth);
            ctx.moveTo(x+recWidth,y);
            ctx.lineTo(x+recWidth,y-recWidth);
            ctx.stroke();
            for(var i = 0; i < n; i++){
                var xPos = x;
                var yPos = y + i * recHeight;
                ctx.strokeRect(xPos,yPos,recWidth,recHeight);
                //ctx.strokeText(i,xPos+recWidth/2,yPos+recWidth+10);
            }
            ctx.strokeText("top",x+recWidth,y);
            ctx.strokeText("bottom",x+recWidth,y+recHeight*n);
            return;
        },

        drift : function(dx, dy) {
            this.style.x += dx;
            this.style.y += dy;
        },

        isCover : function(x, y) {
            var originPos = this.getTansform(x, y);
            x = originPos[0];
            y = originPos[1];

            if (x >= (this.style.x)
                && x <= (this.style.x + this.style.width*2)
                && y >= (this.style.y)
                && y <= (this.style.y + this.style.width*this.style.n)
            ) {
                return true;
            }
            return false;
        }
    }

    require("zrender/tool/util").inherits(MyStack, Base);
    zr.addShape(new MyStack({
        style : {
            x : 50,
            y : 200,
            width:40,
            n:5,
            color : '#1e90ff',
            lineWidth : 1,
            text : 'array'
        },
        draggable : true
    }));

    zr.render();
}




function addCircle(){
    //alert("add");
    var Circle = require("zrender/shape/Circle");
    var shape = new Circle({
        style: {
            x: 200,
            y: 200,
            r: 40,
            brushType: 'both',
            color: "lightblue",
            strokeColor: 'red',
            lineWidth: 1
        },
        draggable:true
    });
    shape.bind("mousewheel",function(params){
        var event = require("zrender/tool/event");
        var delta = event.getDelta(params.event);
        var r = params.target.style.r;
        if(delta > 0){
            r += 5;
        }
        else{
            if(shape.style.r > 10){
                r -= 5;
            }
        }
        zr.modShape(params.target.id, {style: {r: r}});
        zr.refresh();
        event.stop(params.event);
    });
    zr.addShape(shape);
    zr.render();
}




function addText(){

   var Text = require("zrender/shape/Text");
   var shape = new Text({
      style: {
         text: "text",
         x: 100,
         y: 100,
         textFont: '14px Arial'
      },
      draggable:true
   });
    shape.bind("dragend",function(params){
        var event = require("zrender/tool/event");
        console.log(event.getX(params.event).toString()+"px");
        console.log(event.getY(params.event).toString()+"px");
    });

    var time = new Date().getTime();
    shape.bind("mousedown",function(params){
            var currentTime = new Date().getTime();
            if((currentTime - time) < 250){
                console.log("db click");

                var event = require("zrender/tool/event");
                var yLoc = (event.getY(params.event)+picture.offsetTop);
                var xLoc = (event.getX(params.event)+picture.offsetLeft);

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







