/**
 * Created by YBH on 2015/1/15.
 */
function changeToGraphMode(){
    currentState = states.graph;
    graphBoardState = graphBoardStates.graph;
    drawBoardState = drawBoardStates.free;
    $("#mainBoard").removeClass().addClass("graph");

    changeToGraphBoard();
}

//数组图形设计
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
};

//队列图形设计
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
};

//栈图形设计
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
};



function addArray(){
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
    var circle = new Circle({
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
    circle.bind("mousewheel",function(params){
        resizeCircle(params);
    });
    zr.addShape(circle);
    zr.render();
}

function resizeCircle(params){
    var event = require("zrender/tool/event");
    var delta = event.getDelta(params.event);
    var r = params.target.style.r;
    if(delta > 0){
        r += 5;
    }
    else{
        if(params.target.style.r > 10){
            r -= 5;
        }
    }
    zr.modShape(params.target.id, {style: {r: r}});
    zr.refresh();
    event.stop(params.event);
}


function addImage(){
    var image = new ImageShape({
        style: {
            image: "img/img.jpg",
            x: 50,
            y: 50
        },
        draggable:true
    });
    image.bind("dragend",graphDragged);
    zr.addShape(image);
}

//图片拖动监听
function graphDragged(params){
    var event = require("zrender/tool/event");
    console.log(event.getX(params.event).toString()+"px");
    console.log(event.getY(params.event).toString()+"px");
    console.log(params.id);
}