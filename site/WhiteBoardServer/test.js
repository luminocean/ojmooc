
$("#submit").bind("click",function(){
    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:1337/download";
    xhr.open("POST",url,true);
    //xhr.overrideMimeType("application/octet-stream");
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var imgdata = xhr.response;
            var img = new Image();

            console.log(imgdata);
        }
    }
    xhr.send("1427989721914pic.jpg");
});
