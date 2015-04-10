/**
 * Created by blueking on 2015/3/31.
 */
function getByID(id) {
    return document.getElementById(id);
}

var startRecordAudio = $("#record");
var stopRecordingAudio = $("#stop");
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
            start_record();
        }, function() {
        });
    else {
        audio.src = URL.createObjectURL(audioStream);
        audio.muted = true;
        audio.play();
        if (recorder) {
            recorder.startRecording();
            start_record();
        }
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
            recorder.getDataURL(function(audioData){
                fileName = Math.round(Math.random() * 99999999) + 99999999;
                audioContent = {
                    audio:{
                        name : fileName + '.wav',
                        type: 'audio/wav',
                        contents: audioData
                    }
                };
                console.log(audioContent);
                saveVedio();
            });
        });
};

startRecordAudio.on("click",recordAudio);
stopRecordingAudio.on("click",stopRecordAudio);
//playAudio.on("click",play);
audio.addEventListener("ended",function(){
    playAudio.text('播放');
    isFirstClick = true;
    playedTime = 0;
});

