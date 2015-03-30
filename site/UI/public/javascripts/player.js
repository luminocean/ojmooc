/**
 * Created by zy on 2015/3/29.
 */

function doubleWinEvent(){
    $("#editerDiv").css({"width":"70%","display":"block"});
    $("#whiteboardDiv").css({"width":"30%","display":"block"});
    windowController.state=0;
}

function singleEditerEvent(){
    $("#editerDiv").css({"width":"100%","display":"block"});
    $("#whiteboardDiv").css({"display":"none"});
    windowController.state=1;
}

function singleWBoardEvent(){
    $("#editerDiv").css({"display":"none"});
    $("#whiteboardDiv").css({"width":"100%","display":"block"});
    windowController.state=2;
}


function WindowController(){
    this.state=0;
    this.name="WindowController";
}

WindowController.prototype.setAction = function(action){
    console.log(this.name+action);
    this.state=action;
    switch (action){
        case 0:
            doubleWinEvent();
            break;
        case 1:
            singleEditerEvent();
            break;
        case 2:
            singleWBoardEvent();
            break;
        default :
            doubleWinEvent();
    }
};

WindowController.prototype.getScene = function(){
    console.log("get1xia");
    return this.state;
};

WindowController.prototype.setScene = function(state){
    console.log("set1xia");
    this.state=state;
    switch (state){
        case 0:
            doubleWinEvent();
            break;
        case 1:
            singleEditerEvent();
            break;
        case 2:
            singleWBoardEvent();
            break;
        default :
            doubleWinEvent();
    }
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

function start_record(){
    console.log("start record");
    timeline.record();
    $("#editor").change(function(){
        var action = $("#editor").val();
        timeline.saveOneStep(recorder0,action);
    });

    $("#whiteboard").change(function(){
        var action = $("#whiteboard").val();
        timeline.saveOneStep(recorder1,action);
    });

    $("#windowConBtnGro").on("click.frame",".btn",function(e){
        var action=windowController.state;
        timeline.saveOneStep(recorder2,action);
    });
}

function stop_record(){
    console.log("stop record");
    timeline.stop();
    $("#windowConBtnGro").off("click.frame");
}

function playback(){
    console.log("start to play");
    $("#editor").val('');
    $("#whiteboard").val('');
    //totalTime从存储的地方取出总时间
    var totalTime = timeline.getTotalTime();
    timeline.play(0,totalTime);
}

//之后切换窗口这里使用动画 及添加按钮active状态
$("#doubleWinBtn").on("click",doubleWinEvent);
$("#singleEditerBtn").on("click",singleEditerEvent);
$("#singleWBoardBtn").on("click",singleWBoardEvent);


$("#record").click(start_record);
$("#stop").click(stop_record);
$("#play").click(playback);
