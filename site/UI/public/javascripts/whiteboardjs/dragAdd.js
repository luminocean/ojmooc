/**
 * Created by YBH on 2015/3/3.
 */
$("#graphBoard")[0].addEventListener("dragenter",function(event){
    event.stopPropagation();
    event.preventDefault();
});

$("#graphBoard")[0].addEventListener("dragover",function(event){
    event.stopPropagation();
    event.preventDefault();
});

//处理鼠标放下事件，添加图片
$("#graphBoard")[0].addEventListener("drop",function(event){
    event.stopPropagation();
    event.preventDefault();
    var xLoc = event.pageX - $("#graphBoard").offset().left;
    var yLoc = event.pageY - $("#graphBoard").offset().top;

    var files = event.dataTransfer.files;                                   //获取拖拽的所有文件
    for(var i = 0; i < files.length; i++){
        var file = files[i];

        if(file.type.split("/")[0] != "image"){
            alert("不是图片文件！");
            break;
        }
        var reader = new FileReader();                                  //读取图片并显示
        reader.onload = (function(thefile){
            return function(e){
                var image = new Image();
                image.src = e.target.result;
                addImage(generateID(),image,xLoc,yLoc);

                uploadFile(thefile);

                //actionPerformed(new Action(id,"addImage",[imgId,x,y]));
            };
        })(file);
        reader.readAsDataURL(file);



    }
});

function uploadFile(file){
    console.log(file);

    var fd = new FormData();
    fd.append("fileToUpload", file);

    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:1337/";
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var b = xhr.responseText;

            //actionPerformed(new Action(id,"addImage",[imgId,x,y]));
        }
    };
    xhr.open("POST",url,true);
    xhr.send(fd);
}