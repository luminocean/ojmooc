
$("#submit").bind("click",function(){
    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:1337/";
    xhr.open("POST",url,true);
    xhr.overrideMimeType("application/octet-stream");
    xhr.send(1);
});
