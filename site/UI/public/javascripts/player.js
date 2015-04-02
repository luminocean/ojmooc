/**
 * Created by zy on 2015/3/29.
 */
    //窗口运行中 按照像素 固定位置拖动，保存则保存运动比例
var initialPlayerWidth=document.getElementById("playerwholeDiv").clientWidth;
var initialFrameWidth=initialPlayerWidth*0.99;
var initialEditorWidth=initialPlayerWidth*0.59;
var initialWBoardWidth=initialPlayerWidth*0.4;
var minEditerWidth=initialPlayerWidth*0.2;
var maxEditerWidth=initialPlayerWidth*0.8;

function WindowController(){
    this.state=0;//0:双窗口 1:编辑器 2:白板
    this.name="WindowController";
    this.editorWidth=initialEditorWidth;
    this.whiteBoardWidth=initialWBoardWidth;
    this.totalWidth=initialPlayerWidth;
    this.isRecord=false;
    this.isDoubleWin=true;
}

//用于同步框架的传输类型
function WinControlEvent(type,state,editeWidth,wboardWidth){
    this.type=type;//btnEvent or dragEvent
    this.state=state;
    this.editorWidth=editeWidth;
    this.whiteBoardWidth=wboardWidth;
}


function doubleWinClick(){
    windowController.state=0;
    windowController.isDoubleWin=true;
    $("#editerDiv").show().animate({"width":windowController.editorWidth});
    $("#whiteboardDiv").show().animate({"width":windowController.whiteBoardWidth});
}

function singleEditerClick(){
    windowController.state=1;
    windowController.isDoubleWin=false;
    $("#whiteboardDiv").animate({"width":"0%"}).hide();
    $("#editerDiv").show().animate({"width":"99%"});
}

function singleWBoardClick(){
    windowController.state=2;
    windowController.isDoubleWin=false;
    $("#editerDiv").animate({"width":"0%"}).hide();
    $("#whiteboardDiv").show().animate({"width":"99%"});
}

var editorDragOffset = { x: 0, y: 0 };//记录被拖动了多少距离

interact('#editerDiv')
    .resizable({
        edges: { left: false, right: true, bottom: false, top: false }
    })
    .on('resizemove', function (event) {
        var target = event.target;

        // update the element's style
        if(windowController.isDoubleWin){
            var widthChange=event.rect.width/initialPlayerWidth;

            if(event.rect.width>minEditerWidth&&event.rect.width<maxEditerWidth){
                target.style.width  = event.rect.width + 'px';

                // translate when resizing from top or left edges
                editorDragOffset.x += event.deltaRect.right;
                $("#whiteboardDiv").width(initialFrameWidth-event.rect.width);
            }

            if(windowController.isRecord){
                var action=new WinControlEvent("dragEvent",0,event.rect.width,$("#whiteboardDiv").width());
                timeline.saveOneStep(recorder2,action);
            }
        }
        //transform用于这边缩小了，那边再移动相应距离，实现拖动
        //target.style.transform = ('translate('
        //+ offset.x + 'px,'
        //+ offset.y + 'px)');
        //target.style.transform = ('translateX('
        //+ offset.x + 'px');

        //target.textContent = event.rect.width + '×' + event.rect.height;
    });


WindowController.prototype.setAction = function(action){
    console.log(this.name+action.type);
    if(action.type=='btnEvent'){
        this.state=action.state;
        switch (action.state){
            case 0:
                doubleWinClick();
                break;
            case 1:
                singleEditerClick();
                break;
            case 2:
                singleWBoardClick();
                break;
            default :
                doubleWinClick();
        }
    }else if(action.type=='dragEvent'){
        //this.state=action.state;
        $("#editerDiv").width(action.editorWidth);
        $("#whiteboardDiv").width(action.whiteBoardWidth);
    }
};

WindowController.prototype.getScene = function(){
    switch (this.state){
        case 0:
            return new WinControlEvent("",0,$("#editerDiv").width(), $("#whiteboardDiv").width());
        case 1:
            return new WinControlEvent("",1);
        case 2:
            return new WinControlEvent("",2);
        default :
            return null;
    }
};

WindowController.prototype.setScene = function(state){
    switch (state.state){
        case 0:
            this.setEAWwidth(state.editorWidth,state.whiteBoardWidth);
            break;
        case 1:
            singleEditerClick();
            break;
        case 2:
            singleWBoardClick();
            break;
        default :
            doubleWinClick();
            break;
    }
};

WindowController.prototype.setEAWwidth = function(editerWidth,wboardWidth){
    $("#editerDiv").width(editerWidth);
    $("#whiteboardDiv").width(wboardWidth);
};

WindowController.prototype.startRecord = function(){
    this.isRecord=true;
    $("#windowConBtnGro").on("click.frame",".btn",function(e){
        var action=new WinControlEvent("btnEvent",windowController.state);
        timeline.saveOneStep(recorder2,action);
    });
};

WindowController.prototype.stopRecord = function(){
    this.isRecord=false;
    $("#windowConBtnGro").off("click.frame");
};

/**
 * Created by blueking on 2015/3/17.
 */
var editor = function(){
    this.state=null;
    this.name = "editor";
};

editor.prototype.setAction = function(action){
    console.log(this.name+action);
    $("#editor").val(action);
};
editor.prototype.getScene = function(){
    return $("#editor").val();
};



//当调用该函数时，editor和白板应该将当前状态展现到相应组件
editor.prototype.setScene = function(state){
    this.state = state;
    console.log(state);
    $("#editor").val(state);
};


var editor = new editor();
var recorder0 = new recorder(editor);
var recorder1 = new recorder(whiteboard);
var windowController=new WindowController();
var recorder2 = new recorder(windowController);
var timeline = new timeline();
timeline.addRecorder(recorder0);
timeline.addRecorder(recorder1);
timeline.addRecorder(recorder2);

//发送白板action
function sendAction(action){
    console.log(1);
    timeline.saveOneStep(recorder1,action);
}

function start_record(){
    onRecord = true;                            //设置白板状态，可以录制
    console.log("start record");
    timeline.record();
    $("#editor").change(function(){
        var action = $("#editor").val();
        timeline.saveOneStep(recorder0,action);
    });

    windowController.startRecord();

}

function stop_record(){
    onRecord = false;                       //设置白板状态，不可录制
    console.log("stop record");
    timeline.stop();
    windowController.stopRecord();
}

var isFirstClick = true;
function playback(){
    if(isFirstClick == false){
        return;
    }
    clear();                                        //清空白板
    console.log("start to play");
    $("#editor").val('');
    //$("#whiteboard").val('');
    //totalTime从存储的地方取出总时间
    var totalTime = timeline.getTotalTime();
    timeline.play(0,totalTime);
    isFirstClick = false;
}

//窗口放置好后，将player窗口的比例布局，变为像素固定布局
$("#editerDiv").css({"width":windowController.editorWidth});
$("#whiteboardDiv").css({"width":windowController.whiteBoardWidth});

//之后切换窗口这里使用动画 及添加按钮active状态
$("#doubleWinBtn").on("click",doubleWinClick);
$("#singleEditerBtn").on("click",singleEditerClick);
$("#singleWBoardBtn").on("click",singleWBoardClick);

$("#stop").click(stop_record);
$("#play").click(playback);     //如何第一次点击才调用，后面的不再调用
