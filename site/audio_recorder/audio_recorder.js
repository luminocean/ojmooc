/**
 * Created by blueking on 2015/3/30.
*/
function getByID(id) {
    return document.getElementById(id);
}

var startRecordAudio = $("#record-audio");
var stopRecordingAudio = $("#stop-recording-audio");
var audio = getByID('audio');
var playAudio = $("#play");

var audioConstraints = {
    audio: true,
    video: false
};
var audioStream;
var recorder;

function recordAudio() {
    if (!audioStream)
        navigator.getUserMedia(audioConstraints, function(stream) {
            if (window.IsChrome) stream = new window.MediaStream(stream.getAudioTracks());
            audioStream = stream;

            audio.src = URL.createObjectURL(audioStream);
            audio.muted = true;
            audio.play();

            // "audio" is a default type
            recorder = window.RecordRTC(stream, {
                type: 'audio'
            });
            recorder.startRecording();
        }, function() {
        });
    else {
        audio.src = URL.createObjectURL(audioStream);
        audio.muted = true;
        audio.play();
        if (recorder) recorder.startRecording();
    }

    window.isAudio = true;

    startRecordAudio.attr("disabled",true);
    stopRecordingAudio.attr("disabled",false);
};
var screen_constraints;
function stopRecordAudio() {
    stopRecordingAudio.attr("disabled",true);
    startRecordAudio.attr("disabled",false);
    audio.src = '';

    if (recorder)
        recorder.stopRecording(function(url) {
            audio.src = url;
            audio.muted = false;
        });
};

function play(){
    //audio.src = url;
    var playBtnVal = playAudio.text();
    if(playBtnVal == '播放'){
        audio.play();
        playAudio.text('暂停');
    }
    else{
        audio.pause();
        playAudio.text('播放');
    }
}

startRecordAudio.on("click",recordAudio);
stopRecordingAudio.on("click",stopRecordAudio);
playAudio.on("click",play);
audio.addEventListener("ended",function(){
    playAudio.text('播放');
});
