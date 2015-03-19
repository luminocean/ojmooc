/**
 * Created by blueking on 2015/3/16.
 */
var timeline = function(){
    this.startTime = 0;
    this.currentTime = 0;
    this.totalTime = 0;
    this.recorders = [];
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


timeline.prototype.play = function(totalTime){
    var that = this;
    that.startTime = getTimeSeconds(new Date());
    that.totalTime = totalTime;

    //页面时间线根据总时间滚动
    var i = 0;
    var timer = setInterval(function(){
        $("#foreline").css("width", i + "%");
        i++;
        if (i > 100) {
            clearInterval(timer);
        }
    }, 10*totalTime);

    //轮询向各recorder发送播放请求，若recorder检测到时间与记录时间相符则向相应组件发送执行动作请求
    var playInterval = setInterval(function(){
        var currentTime = that.getCurrentTime();
        var recorderCount = that.recorders.length;
        for(var i=0;i<recorderCount;i++){
            that.recorders[i].play(currentTime);
        }
    },100);
    setTimeout(function(){
        console.log("play finished");
        clearInterval(playInterval);
    },totalTime*1000);
};

timeline.prototype.stop = function(){
    this.totalTime = this.getCurrentTime();
    this.currentTime = 0;   //停止录制的时候将currentTime归零
    window.clearInterval(this.timeInterval);
    window.clearInterval(this.recordTimeInterval);

    //存储总的播放时间
};

//控制整个录制流程
timeline.prototype.record = function(){
    var that = this;
    that.startTime = getTimeSeconds(new Date());

    //每隔5S记录当前各组件场景
    that.timeInterval = setInterval(function(){
        var recorderCount = that.recorders.length;
        var currentTime = that.getCurrentTime();
        console.log(currentTime);
        for(var i=0;i<recorderCount;i++){
            console.log(that.recorders[i]);
            that.recorders[i].saveScene(currentTime);
        }
    },5000);

    //时间线上显示已经录制的时间
    that.recordTimeInterval = setInterval(function(){
        var i = 0;
        i = $("#clock").html();                         //获取当前已经录制的时间，秒
        i++;                                             //增加1000毫秒
        $("#clock").html(i);                            //设置当前已经录制时间
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

timeline.prototype.saveToJSON = function(){

};

timeline.prototype.loadFramJSON = function(){

};
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

//播放时
recorder.prototype.getNextTime = function(time){
    var that = this;
    //从timeline取得当前时刻
    var currentTime = time;
    var nextTime;
    var recordsCount = that.step_records.length;
    for(var i =0;i<recordsCount;i++){
        var record = that.step_records[i];
        if(record.time == currentTime){
            record = that.step_records[i+1];
            nextTime = record.time;
            break;
        }
    }
    return nextTime - currentTime;
    //根据时刻匹配到当前写入点
    //将下一个读取点与上一个读取点时间差返回
};

//获取指定时间的操作
recorder.prototype.getStep = function(time){
    var that = this;
    var stepCounts = that.step_records.length;
    for(var i=0;i<stepCounts;i++){
        var step = that.step_records[i];
        if(step.time == time){
            return step.action;
        }
    }
}
//时间线控制实例回放一步，播放时
recorder.prototype.loadStep = function(){
    var that = this;
    var begin = that.timeline.getCurrentTime();
    var currentStep = that.getStep(begin);
    return currentStep;
}

//存储某个场景状态
recorder.prototype.saveScene = function(currentTime){
    var state = this.instance.getScene();
    this.scene_records.push({time:currentTime,state:state});
}

//获取指定时间的场景状态
recorder.prototype.queryScene = function(time){
    var that = this;
    var sceneCounts = that.scene_records.length;
    for(var i=0;i<sceneCounts;i++){
        var scene = that.scene_records[i];
        if(scene.time == time){
            return scene.state;
        }
    }
}