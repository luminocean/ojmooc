/**
 * Created by zy on 2015/3/29.
 */

function doubleWinEvent(){
    $("#editerDiv").css({"width":"70%","display":"block"});
    $("#whiteboardDiv").css({"width":"30%","display":"block"});
}

function singleEditerEvent(){
    $("#editerDiv").css({"width":"100%","display":"block"});
    $("#whiteboardDiv").css({"display":"none"});
}

function singleWBoardEvent(){
    $("#editerDiv").css({"display":"none"});
    $("#whiteboardDiv").css({"width":"100%","display":"block"});
}


function WindowController(){
    this.state=null;
    this.name="WindowController";
}

WindowController.prototype.setAction = function(action){
    console.log(this.name+action);
    $("#whiteboard").val(action);
};

WindowController.prototype.getScene = function(state){
    return $("#whiteboard").val();
};

WindowController.prototype.setScene = function(state){
    this.state = state;
    console.log(state);
    $("#whiteboard").val(state);
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


/**
 * Created by blueking on 2015/3/17.
 */
var whiteboard = function(){
    this.state;
    this.name = "whiteboard";
};

whiteboard.prototype.setAction = function(action){
    console.log(this.name+action);
    $("#whiteboard").val(action);
};

whiteboard.prototype.getScene = function(){
    return $("#whiteboard").val();
};

whiteboard.prototype.setScene = function(state){
    this.state = state;
    console.log(state);
    $("#whiteboard").val(state);
};

var editor = new editor();
var recorder0 = new recorder(editor);
var whiteboard = new whiteboard();
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
}

function stop_record(){
    console.log("stop record");
    timeline.stop();
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
