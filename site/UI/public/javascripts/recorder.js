/**
 * Created by blueking on 2015/3/16.
 */

/**
 * constants
 */
var STATE_TIME_INTERVAL = 5;    //场景之间的时间间隔
var timer;
var playInterval;
var timelineInterval;
var audioContent;

var timeline = function(){
    this.startTime = 0;
    this.currentTime = 0;
    this.totalTime = 0;
    this.recorders = [];
    this.isPause = false;
    /**
     * 每隔一定时间获取各组件当前场景的timeInterval
     * @type {null}
     */
    this.timeInterval = null;

    /**
     * 展示页面上时间线录制时间的timeInterval
     * @type {null}
     */
    this.recordTimeInterval = null;
};

timeline.prototype.addRecorder = function(recorder){
    this.recorders.push(recorder);
}

timeline.prototype.saveOneStep = function(recorder,action){
    var saveTime = this.getCurrentTime();
    recorder.saveStep(saveTime,action);
}


timeline.prototype.play = function(pastTime,totalTime){
    var that = this;
    that.setCurrentTime(pastTime);
    that.totalTime = totalTime;

    //页面时间线根据总时间滚动
    //var i = 0;
    var i = Math.round(pastTime/totalTime*1000);  //根据已经过去的时间线和总时间线的比例调整进度条
    timer = setInterval(function(){
        $("#foreline").css("width", i/10 + "%");
        i++;
        if (i >= 1000) {
            clearInterval(timer);
        }
    }, totalTime);

    //每过100ms轮询向各recorder发送播放请求，若recorder检测到时间与记录时间相符则向相应组件发送执行动作请求
    playInterval = setInterval(function(){
        var currentTime = that.getCurrentTime();
        var recorderCount = that.recorders.length;
        for(var i=0;i<recorderCount;i++){
            that.recorders[i].play(currentTime);
        }
        if(0<=currentTime-totalTime && currentTime-totalTime<=0.1){
            console.log("play finished");
            clearInterval(playInterval);
        }
    },100);

    //每过1S将时间线上显示的时间减1
    var clockTotalTime = Math.round(totalTime-pastTime);
    $("#clock").html(secondsToClockTime(clockTotalTime));
    timelineInterval = setInterval(function(){
        var j = clockTimeToSeconds($("#clock").html());
        j--;
        $("#clock").html(secondsToClockTime(j));
        if(j<=0){
            clearInterval(timelineInterval);
        }
    },1000);

    //总时间不应该变
    $("#backline").click(function(e){
        console.log("time changed");
        var audioControl = document.getElementById("audio");
        var width = e.pageX - $("#backline").offset().left;
        var timelineWidth = $("#backline").width();
        var actulPastTime = Math.round(width/timelineWidth*totalTime);  //从实际时间最近的上一个场景处开始播放
        var usedPastTime = actulPastTime-actulPastTime%5;   //使用的时间，实际时间最近的上一个场景的时间
        clearInterval(playInterval);
        clearInterval(timelineInterval);
        clearInterval(timer);
        audioControl.currentTime = usedPastTime;        //改变音频播放进度
        $("#foreline").css("width",100*usedPastTime/totalTime + "%");    //根据时间比例设置进度条宽度
        var recorderCount = that.recorders.length;
        for(var i=0;i<recorderCount;i++){
            that.recorders[i].playScene(usedPastTime);
        }
        that.play(usedPastTime,totalTime);    //重新设置进度条的位置，重置开始时间，总时间，从当前位置开始播放

    });

};

timeline.prototype.stop = function(){
    this.totalTime = this.getCurrentTime();
    this.currentTime = 0;   //停止录制的时候将currentTime归零
    window.clearInterval(this.timeInterval);
    window.clearInterval(this.recordTimeInterval);

    //存储总的播放时间
};

timeline.prototype.pause = function(){
    var that = this;
    clearInterval(playInterval);
    clearInterval(timelineInterval);
    clearInterval(timer);
    that.setCurrentTime(that.getCurrentTime());
    console.log("pause at" + that.currentTime);
}

//控制整个录制流程
timeline.prototype.record = function(){
    var that = this;
    that.startTime = getTimeSeconds(new Date());

    //每隔5S记录当前各组件场景
    var recorderCount = that.recorders.length;
    var currentTime = that.getCurrentTime();
    console.log(currentTime);
    for(var i=0;i<recorderCount;i++){
        that.recorders[i].saveScene(currentTime);
    }
    that.timeInterval = setInterval(function(){
        var recorderCount = that.recorders.length;
        var currentTime = that.getCurrentTime();
        console.log(currentTime);
        for(var i=0;i<recorderCount;i++){
            that.recorders[i].saveScene(currentTime);
        }
    },STATE_TIME_INTERVAL*1000);

    //时间线上显示已经录制的时间
    that.recordTimeInterval = setInterval(function(){
        var i = clockTimeToSeconds($("#clock").html());                         //获取当前已经录制的时间，秒
        i++;                                             //增加1000毫秒
        $("#clock").html(secondsToClockTime(i));                            //设置当前已经录制时间
    },1000);

};


timeline.prototype.getCurrentTime = function(){
    return this.currentTime + getTimeSeconds(new Date()) - this.startTime;
};

timeline.prototype.setCurrentTime = function(time){
    //每次改变时间点时都刷新开始时间以便于后续计时
    this.currentTime = time;
    this.startTime = getTimeSeconds(new Date());
};

timeline.prototype.getTotalTime = function(){
    return this.totalTime;
};

timeline.prototype.saveVedio = function(){
    console.log(audioContent);
    var rID = 1;
    var that = this;
    var recordCount = that.recorders.length;
    var vedioInfos = [];
    for(var i=0;i<recordCount;i++){
        var instanceType = that.recorders[i].instance.name;
        var stepRecords = that.recorders[i].step_records;
        var sceneRecords = that.recorders[i].scene_records;
        vedioInfos.push({instanceType:instanceType, stepRecords:stepRecords, sceneRecords:sceneRecords});
    }

    $.ajax({
        type: "POST",
        url: "/timeline/recordOver",
        //data: {rID:rID,vedioInfos:JSON.stringify(vedioInfos),audiocontent:JSON.stringify(audioContent)},
        //data: {audiocontent:audioContent},
        data: {rID:rID,vedioInfos:JSON.stringify(vedioInfos)},
        dataType: "json",
        success: function (msg) {
            alert(msg.info);
        },
        error: function () {
            console.log("can not save the vedio");
        }
    });
}

timeline.prototype.LoadVedio = function(vedioSrc){
    var that = this;
    //加载对应的视频数据
}

//获取日期对应的秒数
function getTimeSeconds(date){
    return date.getTime()/1000;
}
function recorder(instance){
    var that = this;
    that.instance = instance;
    that.step_records = [];
    that.scene_records = [];
};

//控制整个播放过程
recorder.prototype.play = function(currentTime){
    var that = this;
    var stepCount = that.step_records.length;
    for(var i=0;i<stepCount;i++){
        var recordTime = that.step_records[i].time;
        if((recordTime-currentTime)>=0 && (recordTime-currentTime)<=0.1) {
            var recordAction = that.step_records[i].action;
            that.instance.setAction(recordAction);
        }
    }
}


//实例上保存单步操作时调用
recorder.prototype.saveStep = function(savetime,action){
    this.step_records.push({time:savetime,action:action});
};

//存储某个场景状态
recorder.prototype.saveScene = function(currentTime){
    var that = this;
    var state = that.instance.getScene();
    console.log(state);
    that.scene_records.push({time:currentTime,state:state});
}

//获取指定时间的场景状态
recorder.prototype.playScene = function(currentTime){
    var that = this;
    var sceneCount = that.scene_records.length;
    for(var i=0;i<sceneCount;i++){
        var recordTime = that.scene_records[i].time;
        if((recordTime-currentTime)>=0 && (recordTime-currentTime)<=0.1) {
            var currentState = that.scene_records[i].state;
            that.instance.setScene(currentState);
        }
    }
}

function secondsToClockTime(seconds){
    var hour = Math.floor(seconds/3600);
    var minute = Math.floor((seconds%3600)/60);
    var second = seconds%60;
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    if(second < 10){
        second = "0" + second;
    }
    var clockTime = hour + ":" + minute + ":" + second;
    return clockTime;
}

function clockTimeToSeconds(clockTime){
    var seconds = parseInt(clockTime.charAt(0)) * 36000 + parseInt(clockTime.charAt(1)) * 3600
        + parseInt(clockTime.charAt(3)) * 600 + parseInt(clockTime.charAt(4)) * 60
        + parseInt(clockTime.charAt(6)) * 10 + parseInt(clockTime.charAt(7));
    return seconds;
}