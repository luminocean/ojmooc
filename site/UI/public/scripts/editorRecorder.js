/**
 * Created by savio on 2015/3/25.
 */
var editor = function () {
    this.state=null;
    this.name = "editor";
}

editor.prototype.setAction = function(action){
    console.log(this.name+action);
    $("#editor").val(action);
}

var editor = ace.edit("editor");
var recorder = new recorder(editor);
var timeline = new timeline();
timeline.addRecorder(recorder);


function start_record(){
    console.log("start record");
    timeline.record();
    $("#editor").change(function(){
        var action = editor.getValue();
        timeline.saveOneStep(recorder,action);
    });
}

function stop_record(){
    console.log("stop record");
    timeline.stop();
}

function playback(){
    console.log("start to play");
    $("#editor").val('');
    //totalTime从存储的地方取出总时间
    var totalTime = timeline.getTotalTime();
    timeline.play(totalTime);
}