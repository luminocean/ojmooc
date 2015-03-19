/**
 * Created by blueking on 2015/3/17.
 */
var editor = function(){
    this.state=null;
    this.name = "editor";
}

editor.prototype.setAction = function(action){
    console.log(this.name+action);
    $("#editor").val(action);
}
editor.prototype.getScene = function(){
    return this.state;
}

//当调用该函数时，editor和白板应该将当前状态展现到相应组件
editor.prototype.setScene = function(state){
    this.state = state;
    console.log(state);
}

/**
 * Created by blueking on 2015/3/17.
 */
var whiteboard = function(){
    this.state;
    this.name = "whiteboard";
}

whiteboard.prototype.setAction = function(action){
    console.log(this.name+action);
    $("#whiteboard").val(action);
}

whiteboard.prototype.getScene = function(){
    return this.state;
}

var editor = new editor();
var recorder0 = new recorder(editor);
var whiteboard = new whiteboard();
var recorder1 = new recorder(whiteboard);
var timeline = new timeline();
timeline.addRecorder(recorder0);
timeline.addRecorder(recorder1);

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
    timeline.play(totalTime);
}