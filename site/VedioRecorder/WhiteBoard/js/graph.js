var dbcstart = new Date().getTime();

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
        var val = style.val;
        var recWidth = style.width;
        for(var i = 0; i < n; i++){
            var xPos = x + i * recWidth;
            var yPos = y;
            ctx.strokeRect(xPos,yPos,recWidth,recWidth);
            ctx.strokeText(val[i],xPos+recWidth/4,yPos+recWidth/2+10);
            ctx.strokeText(i,xPos+recWidth/2,yPos+recWidth+10);
        }
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
        var val = style.val;
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
            ctx.strokeText(val[i],xPos+recWidth/2,yPos+recWidth/2+10);
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
        var val = style.val;
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
            ctx.strokeText(val[n-1-i],xPos+recWidth/2,yPos+recHeight/2+10);
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

//if图形设计
function MyIf(options) {
    Base.call(this, options);
}
MyIf.prototype = {
    type: "if",
    brush: function (ctx, isHighlight) {
        var style = this.style || {};
        var x = style.x;
        var y = style.y;
        var length = style.length;
        var val = style.val;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+length);
        ctx.lineTo(x-(length/10), y + length -(length/10));
        ctx.moveTo(x, y+length);
        ctx.lineTo(x+(length/10), y + length -(length/10));
        ctx.moveTo(x, y+length);
        ctx.lineTo(x-length, y+length+length/2);
        ctx.lineTo(x, y+length+length);
        ctx.lineTo(x+length, y+length+length/2);
        ctx.lineTo(x, y+length);
        ctx.moveTo(x-length, y+length+length/2);
        ctx.lineTo(x-length-length, y+length+length/2);
        ctx.lineTo(x-length-length, y+2*length+length/2);
        ctx.lineTo(x-length-length-length/10, y+2*length+length/2-length/10);
        ctx.moveTo(x-length-length, y+2*length+length/2);
        ctx.lineTo(x-length-length+length/10, y+2*length+length/2-length/10);
        ctx.moveTo(x+length, y+length+length/2);
        ctx.lineTo(x+length+length, y+length+length/2);
        ctx.lineTo(x+length+length, y+2*length+length/2);
        ctx.lineTo(x+length+length-length/10, y+2*length+length/2-length/10);
        ctx.moveTo(x+length+length, y+2*length+length/2);
        ctx.lineTo(x+length+length+length/10, y+2*length+length/2-length/10);
        ctx.stroke();
        ctx.strokeText("yes",x-2*length,y+length+length/2);
        ctx.strokeText("no",x+2*length,y+length+length/2);
        ctx.strokeRect(x-3*length,y+5/2*length,2*length,length);
        ctx.strokeRect(x+length,y+5/2*length,2*length,length);
        ctx.strokeText(val[0],x-length+10, y+length+length/2);
        ctx.strokeText(val[1],x-3*length,y+5/2*length+10);
        ctx.strokeText(val[2],x+length,y+5/2*length+10);
        return;
    },

    drift: function (dx, dy) {
        this.style.x += dx;
        this.style.y += dy;
    },

    isCover: function (x, y) {
        var originPos = this.getTansform(x, y);
        x = originPos[0];
        y = originPos[1];

        if (x >= (this.style.x - 3*this.style.length)
            && x <= (this.style.x + 3*this.style.length)
            && y >= (this.style.y)
            && y <= (this.style.y + 3*this.style.length)
        ) {
            return true;
        }
        return false;
    }
};

//while图形设计
function MyWhile(options) {
    Base.call(this, options);
}
MyWhile.prototype = {
    type: "while",
    brush: function (ctx, isHighlight) {
        var style = this.style || {};
        var x = style.x;
        var y = style.y;
        var length = style.length;
        var val = style.val;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+length);
        ctx.lineTo(x-(length/10), y + length -(length/10));
        ctx.moveTo(x, y+length);
        ctx.lineTo(x+(length/10), y + length -(length/10));
        ctx.moveTo(x, y+length);
        ctx.lineTo(x-length, y+length+length/2);
        ctx.lineTo(x, y+length+length);
        ctx.lineTo(x+length, y+length+length/2);
        ctx.lineTo(x, y+length);
        ctx.moveTo(x-length, y+length+length/2);
        ctx.lineTo(x-length-length, y+length+length/2);
        ctx.lineTo(x-length-length, y+2*length+length/2);
        ctx.lineTo(x-length-length-length/10, y+2*length+length/2-length/10);
        ctx.moveTo(x-length-length, y+2*length+length/2);
        ctx.lineTo(x-length-length+length/10, y+2*length+length/2-length/10);
        ctx.moveTo(x, y+2*length);
        ctx.lineTo(x, y+3*length);
        ctx.lineTo(x-length/10, y+3*length-length/10);
        ctx.moveTo(x, y+3*length);
        ctx.lineTo(x+length/10, y+3*length-length/10);
        ctx.moveTo(x, y+3*length);
        ctx.lineTo(x-length, y+3*length);
        ctx.lineTo(x-length, y+4*length);
        ctx.lineTo(x+length, y+4*length);
        ctx.lineTo(x+length, y+3*length);
        ctx.lineTo(x, y+3*length);
        ctx.moveTo(x+length, y+3*length+length/2);
        ctx.lineTo(x+2*length, y+3*length+length/2);
        ctx.lineTo(x+2*length, y+length+length/2);
        ctx.lineTo(x+length, y+length+length/2);
        ctx.lineTo(x+length+length/10, y+length+length/2-length/10);
        ctx.moveTo(x+length, y+length+length/2);
        ctx.lineTo(x+length+length/10, y+length+length/2+length/10);
        ctx.stroke();
        ctx.strokeText(val[0],x-length+10, y+length+length/2);
        ctx.strokeText(val[1],x-length, y+3*length+length/2);
        return;
    },

    drift: function (dx, dy) {
        this.style.x += dx;
        this.style.y += dy;
    },

    isCover: function (x, y) {
        var originPos = this.getTansform(x, y);
        x = originPos[0];
        y = originPos[1];

        if (x >= (this.style.x - 2*this.style.length)
            && x <= (this.style.x + 2*this.style.length)
            && y >= (this.style.y)
            && y <= (this.style.y + 4*this.style.length)
        ) {
            return true;
        }
        return false;
    }
};


//dowhile图形设计
function MyDoWhile(options) {
    Base.call(this, options);
}
MyDoWhile.prototype = {
    type: "dowhile",
    brush: function (ctx, isHighlight) {
        var style = this.style || {};
        var x = style.x;
        var y = style.y;
        var length = style.length;
        var val = style.val;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+length);
        ctx.lineTo(x-(length/10), y + length -(length/10));
        ctx.moveTo(x, y+length);
        ctx.lineTo(x+(length/10), y + length -(length/10));
        ctx.moveTo(x, y+length);
        ctx.lineTo(x-length, y+length);
        ctx.lineTo(x-length, y+2*length);
        ctx.lineTo(x+length, y+2*length);
        ctx.lineTo(x+length, y+length);
        ctx.lineTo(x, y+length);
        ctx.moveTo(x, y+2*length);
        ctx.lineTo(x, y+3*length);
        ctx.lineTo(x-length/10, y+3*length-length/10);
        ctx.moveTo(x, y+3*length);
        ctx.lineTo(x+length/10, y+3*length-length/10);
        ctx.moveTo(x, y+3*length);
        ctx.lineTo(x-length, y+3*length+length/2);
        ctx.lineTo(x, y+4*length);
        ctx.lineTo(x+length, y+3*length+length/2);
        ctx.lineTo(x, y+3*length);
        ctx.moveTo(x+length, y+3*length+length/2);
        ctx.lineTo(x+2*length, y+3*length+length/2);
        ctx.lineTo(x+2*length, y+length+length/2);
        ctx.lineTo(x+length, y+length+length/2);
        ctx.lineTo(x+length+length/10, y+length+length/2-length/10);
        ctx.moveTo(x+length, y+length+length/2);
        ctx.lineTo(x+length+length/10, y+length+length/2+length/10);
        ctx.moveTo(x-length, y+3*length+length/2);
        ctx.lineTo(x-2*length, y+3*length+length/2);
        ctx.lineTo(x-2*length, y+4*length+length/2);
        ctx.lineTo(x-2*length-length/10, y+4*length+length/2-length/10);
        ctx.moveTo(x-2*length, y+4*length+length/2);
        ctx.lineTo(x-2*length+length/10, y+4*length+length/2-length/10);
        ctx.stroke();
        ctx.strokeText(val[0],x-length, y+length+length/2);
        ctx.strokeText(val[1],x-length+10, y+3*length+length/2);
        return;
    },

    drift: function (dx, dy) {
        this.style.x += dx;
        this.style.y += dy;
    },

    isCover: function (x, y) {
        var originPos = this.getTansform(x, y);
        x = originPos[0];
        y = originPos[1];

        if (x >= (this.style.x - this.style.length)
            && x <= (this.style.x + 2*this.style.length)
            && y >= (this.style.y)
            && y <= (this.style.y + 4*this.style.length)
        ) {
            return true;
        }
        return false;
    }
};

//operation图形设计
function MyOperation(options) {
    Base.call(this, options);
}
MyOperation.prototype = {
    type: "operation",
    brush: function (ctx, isHighlight) {
        var style = this.style || {};
        var x = style.x;
        var y = style.y;
        var length = style.length;
        var val = style.val;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+length);
        ctx.lineTo(x-(length/10), y + length -(length/10));
        ctx.moveTo(x, y+length);
        ctx.lineTo(x+(length/10), y + length -(length/10));
        ctx.moveTo(x, y+length);
        ctx.lineTo(x-length, y+length);
        ctx.lineTo(x-length, y+2*length);
        ctx.lineTo(x+length, y+2*length);
        ctx.lineTo(x+length, y+length);
        ctx.lineTo(x, y+length);
        ctx.stroke();
        ctx.strokeText(val[0],x-length, y+length+length/2);
        return;
    },

    drift: function (dx, dy) {
        this.style.x += dx;
        this.style.y += dy;
    },

    isCover: function (x, y) {
        var originPos = this.getTansform(x, y);
        x = originPos[0];
        y = originPos[1];

        if (x >= (this.style.x - this.style.length)
            && x <= (this.style.x + this.style.length)
            && y >= (this.style.y)
            && y <= (this.style.y + 2*this.style.length)
        ) {
            return true;
        }
        return false;
    }
};

function addOperation(id,val){
    require("zrender/tool/util").inherits(MyOperation, Base);
    var o = new MyOperation({
        id:id,
        style : {
            x : 150,
            y : 50,
            preLocation:[150,50],
            length:30,
            val:val,
            color : '#1e90ff',
            lineWidth : 1
        },
        draggable : true
    });
    o.bind("mousewheel",resizeIf);
    o.bind("mousedown",editOperation);
    o.bind("dragend",Dragged);
    o.bind("mousedown",getLocation);
    zr.addShape(o);
    zr.render();

    addObjs(o);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addOperation",val));                           //添加do图形
}

function editOperation(params){
    var currentTime = new Date().getTime();
    if((currentTime - dbcstart) < 300){
        var shape = params.target;
        var event = require("zrender/tool/event");
        var yLoc = (event.getY(params.event)+graphBoard.offsetTop);
        var xLoc = (event.getX(params.event)+graphBoard.offsetLeft);

        var editVal = $.layer({
            type: 1,
            title: false,
            offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
            area: ["220px","20px"],
            border: [0], //去掉默认边框
            shade: [0], //去掉遮罩
            closeBtn: [0, true],
            page: {
                html: '<div style="width:220px; height:20px;">' +
                '<label>do</label><input id="operation" class="textField" type="text"><br>' +
                '</div>'
            }
        });
        $("#operation").val(params.target.style.val[0]);

        $(".textField").bind("keydown",function(e){
            if(e.keyCode == 13){
                var preVal = [params.target.style.val[0]];

                params.target.style.val[0] = $("#operation").val();
                layer.close(editVal);
                zr.render();

                var id = shape.id;
                var val = [shape.style.val[0],shape.style.val[1],shape.style.val[2]];
                addOpes(new Operation(id,"editGraph",val,preVal));

                actionPerformed(new Action(id,"editGraph",val));              //修改do图形
            }
        });
    }
    dbcstart = currentTime;
}

function addDoWhile(id,val){
    require("zrender/tool/util").inherits(MyDoWhile, Base);
    var d = new MyDoWhile({
        id:id,
        style : {
            x : 150,
            y : 50,
            preLocation:[150,50],
            length:30,
            val:val,
            color : '#1e90ff',
            lineWidth : 1
        },
        draggable : true
    });
    d.bind("mousewheel",resizeIf);
    d.bind("mousedown",editDoWhile);
    d.bind("dragend",Dragged);
    d.bind("mousedown",getLocation);
    zr.addShape(d);
    zr.render();

    addObjs(d);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addDoWhile",val));                       //添加dowhile操作
}

function editDoWhile(params){
    var currentTime = new Date().getTime();
    if((currentTime - dbcstart) < 300){
        var shape = params.target;
        var event = require("zrender/tool/event");
        var yLoc = (event.getY(params.event)+graphBoard.offsetTop);
        var xLoc = (event.getX(params.event)+graphBoard.offsetLeft);

        var editVal = $.layer({
            type: 1,
            title: false,
            offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
            area: ["220px","60px"],
            border: [0], //去掉默认边框
            shade: [0], //去掉遮罩
            closeBtn: [0, true],
            page: {
                html: '<div style="width:220px; height:50px;">' +
                '<label>do</label><input id="do" class="textField" type="text"><br>' +
                '<label>while</label><input id="while" class="textField" type="text"></div>'
            }
        });
        $("#do").val(params.target.style.val[0]);
        $("#while").val(params.target.style.val[1]);

        $(".textField").bind("keydown",function(e){
            if(e.keyCode == 13){
                var preVal = [ params.target.style.val[0], params.target.style.val[1]];

                params.target.style.val[0] = $("#do").val();
                params.target.style.val[1] = $("#while").val();
                layer.close(editVal);
                zr.render();

                var id = shape.id;
                var val = [shape.style.val[0],shape.style.val[1],shape.style.val[2]];
                addOpes(new Operation(id,"editGraph",val,preVal));

                actionPerformed(new Action(id,"editGraph",val));              //修改dowhile图形
            }
        });
    }
    dbcstart = currentTime;
}

function addWhile(id,val){
    require("zrender/tool/util").inherits(MyWhile, Base);
    var w = new MyWhile({
        id:id,
        style : {
            x : 150,
            y : 50,
            preLocation:[150,50],
            length:30,
            val:val,
            color : '#1e90ff',
            lineWidth : 1
        },
        draggable : true
    });
    w.bind("mousewheel",resizeIf);
    w.bind("mousedown",editWhile);
    w.bind("dragend",Dragged);
    w.bind("mousedown",getLocation);
    zr.addShape(w);
    zr.render();

    addObjs(w);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addWhile",val));                             //添加while图形
}

function editWhile(params){
    var currentTime = new Date().getTime();
    if((currentTime - dbcstart) < 300){
        var shape = params.target;
        var event = require("zrender/tool/event");
        var yLoc = (event.getY(params.event)+graphBoard.offsetTop);
        var xLoc = (event.getX(params.event)+graphBoard.offsetLeft);

        var editVal = $.layer({
            type: 1,
            title: false,
            offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
            area: ["220px","60px"],
            border: [0], //去掉默认边框
            shade: [0], //去掉遮罩
            closeBtn: [0, true],
            page: {
                html: '<div style="width:220px; height:50px;">' +
                '<label>while</label><input id="while" class="textField" type="text"><br>' +
                '<label>do</label><input id="do" class="textField" type="text"></div>'
            }
        });
        $("#while").val(params.target.style.val[0]);
        $("#do").val(params.target.style.val[1]);

        $(".textField").bind("keydown",function(e){
            if(e.keyCode == 13){
                var preVal = [params.target.style.val[0],params.target.style.val[1]];

                params.target.style.val[0] = $("#while").val();
                params.target.style.val[1] = $("#do").val();
                layer.close(editVal);
                zr.render();

                var id = shape.id;
                var val = [shape.style.val[0],shape.style.val[1],shape.style.val[2]];
                addOpes(new Operation(id,"editGraph",val,preVal));

                actionPerformed(new Action(id,"editGraph",val));              //修改while图形
            }
        });
    }
    dbcstart = currentTime;
}


function addIf(id,val){
    require("zrender/tool/util").inherits(MyIf, Base);
    var i = new MyIf({
        id:id,
        style : {
            x : 150,
            y : 50,
            preLocation:[150,50],
            length:30,
            val:val,
            color : '#1e90ff',
            lineWidth : 1
        },
        draggable : true
    });
    i.bind("mousewheel",resizeIf);
    i.bind("mousedown",editIf);
    i.bind("dragend",Dragged);
    i.bind("mousedown",getLocation);
    zr.addShape(i);
    zr.render();

    addObjs(i);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addIf",val));            //添加if图形
}

function editIf(params){
    var currentTime = new Date().getTime();
    if((currentTime - dbcstart) < 300){
        var shape = params.target;
        var event = require("zrender/tool/event");
        var yLoc = (event.getY(params.event)+graphBoard.offsetTop);
        var xLoc = (event.getX(params.event)+graphBoard.offsetLeft);

        var editVal = $.layer({
            type: 1,
            title: false,
            offset:[yLoc.toString()+"px",xLoc.toString()+"px"],
            area: ["220px","60px"],
            border: [0], //去掉默认边框
            shade: [0], //去掉遮罩
            closeBtn: [0, true],
            page: {
                html: '<div style="width:220px; height:50px;">' +
                '<label>if</label><input id="if" class="textField" type="text"><br>' +
                '<label>do</label><input id="do" class="textField" type="text"><br>' +
                '<label>else</label><input id="else" class="textField" type="text"></div>'
            }
        });
        $("#if").val(shape.style.val[0]);
        $("#do").val(shape.style.val[1]);
        $("#else").val(shape.style.val[2]);

        $(".textField").bind("keydown",function(e){
            if(e.keyCode == 13){
                var preVal = [shape.style.val[0],shape.style.val[1],shape.style.val[2]];
                shape.style.val[0] = $("#if").val();
                shape.style.val[1] = $("#do").val();
                shape.style.val[2] = $("#else").val();
                layer.close(editVal);
                zr.render();

                var id = shape.id;
                var val = [shape.style.val[0],shape.style.val[1],shape.style.val[2]];
                addOpes(new Operation(id,"editGraph",val,preVal));

                actionPerformed(new Action(id,"editGraph",val));              //修改if图形
            }
        });
    }
    dbcstart = currentTime;
}



function addArray(id,val){
    require("zrender/tool/util").inherits(MyArray, Base);
    var arr = new MyArray({
        id:id,
        style : {
            x : 50,
            y : 50,
            preLocation:[50,50],
            width:30,
            n:val.length,
            val:val,
            color : '#1e90ff',
            lineWidth : 1
        },
        draggable : true
    });
    arr.bind("mousedown",dbClick);
    arr.bind("mousewheel",resizeArray);
    arr.bind("dragend",Dragged);
    arr.bind("mousedown",getLocation);
    zr.addShape(arr);
    zr.render();

    addObjs(arr);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addArray",val));
}




function addQueue(id,val){
    require("zrender/tool/util").inherits(MyQueue, Base);
    var que = new MyQueue({
        id:id,
        style : {
            x : 50,
            y : 50,
            preLocation:[50,50],
            width:40,
            n:val.length,
            val:val,
            color : '#1e90ff',
            lineWidth : 1
        },
        draggable : true
    });
    que.bind("mousewheel",resizeArray);
    que.bind("mousedown",dbClick);
    que.bind("dragend",Dragged);
    que.bind("mousedown",getLocation);
    zr.addShape(que);
    zr.render();

    addObjs(que);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addQueue",val));
}


function addStack(id,val){
    require("zrender/tool/util").inherits(MyStack, Base);
    var sta = new MyStack({
        id:id,
        style : {
            x : 50,
            y : 150,
            preLocation:[50,150],
            width:40,
            n:val.length,
            val:val,
            color : '#1e90ff',
            lineWidth : 1
        },
        draggable : true
    });
    sta.bind("mousedown",dbClick);
    sta.bind("mousewheel",resizeArray);
    sta.bind("dragend",Dragged);
    sta.bind("mousedown",getLocation);
    zr.addShape(sta);
    zr.render();

    addObjs(sta);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addStack",val));
}




function addCircle(id,txt,r,x,y){
    var circle = new Circle({
        id:id,
        style: {
            text:txt,
            textColor:"black",
            textPosition:"inside",
            x: x,
            y: y,
            preLocation:[x,y],
            r: r,
            brushType: 'both',
            color: "lightblue",
            strokeColor: 'red',
            lineWidth: 1
        },
        draggable:true
    });
    circle.bind("mousewheel",resizeCircle);
    circle.bind("dragend",Dragged);
    circle.bind("mousedown",getLocation);
    circle.bind("mousedown",dbClicked);
    circle.drift = drift;
    zr.addShape(circle);
    zr.render();

    addObjs(circle);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addCircle",[txt,r,x,y]));
}



function addSquare(id,txt,r,x,y){
    var shape = new Rectangle({
        id:id,
        style: {
            text:txt,
            textColor:"black",
            textPosition:"inside",
            x: x,
            y: y,
            preLocation:[x,y],
            width: r,
            height: r,
            brushType: 'both',
            color:"lightblue",
            strokeColor: 'red',
            lineWidth: 1
        },
        draggable:true
    });
    shape.bind("mousewheel",resizeSquare);
    shape.bind("dragend",Dragged);
    shape.bind("mousedown",getLocation);
    shape.bind("mousedown",dbClicked);
    shape.drift = drift;
    zr.addShape(shape);
    zr.render();

    addObjs(shape);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addSquare",[txt,r,x,y]));
}




function addRectangle(id,txt,w,h,x,y){
    var shape = new Rectangle({
        id:id,
        style: {
            text:txt,
            textColor:"black",
            textPosition:"inside",
            x: x,
            y: y,
            preLocation:[x,y],
            width: w,
            height: h,
            brushType: 'both',
            color:"lightblue",
            strokeColor: 'red',
            lineWidth: 1
        },
        draggable:true
    });
    shape.bind("mousewheel",resizeRectangle);
    shape.bind("dragend",Dragged);
    shape.bind("mousedown",getLocation);
    shape.bind("mousedown",dbClicked);
    shape.drift = drift;
    zr.addShape(shape);
    zr.render();

    addObjs(shape);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addRectangle",[txt,w,h,x,y]));
}

function addTriangle(id,txt,r,x,y){
    var shape = new IsogonShape({
        id:id,
        style : {
            text:txt,
            textColor:"black",
            textPosition:"inside",
            x : x,
            y : y,
            preLocation:[x,y],
            r : r,
            n : 3,
            brushType : 'both',
            color : "lightblue",
            strokeColor : "black",
            lineWidth : 1
        },
        draggable : true
    });
    shape.bind("mousewheel",resizeCircle);
    shape.bind("dragend",Dragged);
    shape.bind("mousedown",getLocation);
    shape.bind("mousedown",dbClicked);
    shape.drift = drift;
    zr.addShape(shape);
    zr.render();

    addObjs(shape);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addTriangle",[txt,r,x,y]));
}



function addImage(id,img,x,y){
    var image = new ImageShape({
        id:id,
        style: {
            image: img,
            x: x,
            y: y,
            preLocation:[50,50]
        },
        draggable:true,
        ignore:false
    });
    image.bind("mousewheel",resizeRectangle);
    image.bind("dragend",Dragged);
    image.bind("mousedown",getLocation);
    image.drift = drift;
    zr.addShape(image);
    zr.render();

    addObjs(image);
    addOpes(new Operation(id,"addShape"));

    actionPerformed(new Action(id,"addImage",[img,x,y]));
}

function drift(dx,dy){
    this.style.x += dx;
    this.style.y += dy;
}

//图形拖动监听
function Dragged(params){
    var event = require("zrender/tool/event");
    var shape = params.target;
    var xLoc = event.getX(params.event);
    var yLoc = event.getY(params.event);
    addOpes(new Operation(shape.id,"drag",[shape.style.x,shape.style.y],[shape.style.preLocation[0],shape.style.preLocation[1]]));

    actionPerformed(new Action(shape.id,"drag",[shape.style.x,shape.style.y]));                                     //图形拖动操作

    if((xLoc <= 1)||(xLoc >= 498)||(yLoc <= 1)||(yLoc >= 430)){
        $.layer({
            shade: [0],
            area: ['auto','auto'],
            dialog: {
                msg: "确定要删除该图形吗？",
                btns: 2,
                type: 4,
                btn: ["取消","确定"],
                yes: function(index){                          //按钮1，取消监听
                    if(xLoc <= 1){
                        shape.style.x = 10;
                    }
                    zr.render();
                    layer.close(index);
                },
                no: function(){                                //按钮2，确定监听
                    shape.ignore = true;
                    zr.render();

                    addOpes(new Operation(shape.id,"shapeVisible",[true],[false]));

                    actionPerformed(new Action(shape.id,"delShape",false));                                 //删除图形操作
                }
            }
        });
    }
}


//数组，栈，队列双击，修改内容
function dbClick(params){
    var currentTime = new Date().getTime();
    if((currentTime - dbcstart) < 300){
        var shape = params.target;
        var event = require("zrender/tool/event");
        var yLoc = (event.getY(params.event)+graphBoard.offsetTop);
        var xLoc = (event.getX(params.event)+graphBoard.offsetLeft);

        var editVal = $.layer({
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
        var val = shape.style.val;

        var s = new String();
        for(var i = 0; i < val.length; i++){
            s+=val[i];
            if(i != val.length-1){
                s+=",";
            }
        }
        textField.val(s);

        textField.bind("keydown",function(e){
            if(e.keyCode == 13){
                var preVal = new Array();
                for(var i = 0; i < shape.style.val.length; i++){
                    preVal[i] = shape.style.val[i];
                }

                var arr = textField.val().split(",");
                shape.style.n = arr.length;
                shape.style.val = arr;
                layer.close(editVal);
                zr.render();

                var id = shape.id;
                var val = new Array();
                for(var i = 0; i < arr.length; i++){
                    val[i] = arr[i];
                }
                addOpes(new Operation(id,"editDataStructure",val,preVal));

                actionPerformed(new Action(id,"editDataStructure",val));
            }
        });
    }
    dbcstart = currentTime;
}


//调整大小
//圆，三角
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
    var preVal = params.target.style.r;
    var val = r;
    zr.modShape(params.target.id, {style: {r: r}});
    zr.refresh();
    event.stop(params.event);

    addOpes(new Operation(params.target.id,"resizeCircle",val,preVal));

    actionPerformed(new Action(params.target.id,"resizeCircle",val));
}
//数组，栈，队列
function resizeArray(params){
    var event = require("zrender/tool/event");
    var delta = event.getDelta(params.event);
    var width = params.target.style.width;
    if(delta > 0){
        width += 5;
    }
    else{
        if(params.target.style.width > 10){
            width -= 5;
        }
    }
    var preVal = params.target.style.width;
    var val = width;
    zr.modShape(params.target.id, {style: {width: width}});
    zr.refresh();
    event.stop(params.event);

    addOpes(new Operation(params.target.id,"resizeArray",val,preVal));

    actionPerformed(new Action(params.target.id,"resizeArray",val));
}
//if，while，dowhile
function resizeIf(params){
    var event = require("zrender/tool/event");
    var delta = event.getDelta(params.event);
    var length = params.target.style.length;
    if(delta > 0){
        length += 5;
    }
    else{
        if(params.target.style.length > 10){
            length -= 5;
        }
    }
    var preVal = params.target.style.length;
    var val = length;
    zr.modShape(params.target.id, {style: {length: length}});
    zr.refresh();
    event.stop(params.event);

    addOpes(new Operation(params.target.id,"resizeIf",val,preVal));

    actionPerformed(new Action(params.target.id,"resizeIf",val));
}
//长方形,图片
function resizeRectangle(params){
    var event = require("zrender/tool/event");
    var delta = event.getDelta(params.event);
    var width = params.target.style.width;
    var height = params.target.style.height;

    if(delta > 0){
        width += 5;
        height += 5*height/width;
    }
    else{
        if((params.target.style.width > 10)&&(params.target.style.height > 10)){
            width -= 5;
            height -= 5*height/width;
        }
    }
    var preVal = [params.target.style.width,params.target.style.height];
    var val = [width,height];
    zr.modShape(params.target.id, {style: {width:width,height:height}});
    zr.refresh();
    event.stop(params.event);

    addOpes(new Operation(params.target.id,"resizeRectangle",val,preVal));

    actionPerformed(new Action(params.target.id,"resizeRectangle",val));
}
//正方形
function resizeSquare(params){
    var event = require("zrender/tool/event");
    var delta = event.getDelta(params.event);
    var width = params.target.style.width;
    var height = params.target.style.height;

    if(delta > 0){
        width += 5;
        height += 5;
    }
    else{
        if((params.target.style.width > 10)&&(params.target.style.height > 10)){
            width -= 5;
            height -= 5;
        }
    }
    var preVal = [params.target.style.width,params.target.style.height];
    var val = [width,height];
    zr.modShape(params.target.id, {style: {width:width,height:height}});
    zr.refresh();
    event.stop(params.event);

    addOpes(new Operation(params.target.id,"resizeRectangle",val,preVal));

    actionPerformed(new Action(params.target.id,"resizeRectangle",val));
}