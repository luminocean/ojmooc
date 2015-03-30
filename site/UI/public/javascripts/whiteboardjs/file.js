/**
 * Created by YBH on 2015/1/16.
 */

//添加文件拖动监听
function addFileListener(){
    var container = $("#fileBoard")[0];
    //var fileList = $("#fileList")[0];

    //文件拖进监听
    container.addEventListener("dragenter",function(event){
        //fileList.innerHTML = "";
        event.stopPropagation();
        event.preventDefault();
    });

    //文件拖过监听
    container.addEventListener("dragover",function(event){
        event.stopPropagation();
        event.preventDefault();
    });

    //放下鼠标监听
    container.addEventListener("drop",handleDrop);
}

//放下鼠标，添加文件
function handleDrop(event){
    var files = event.dataTransfer.files;
    console.log(files);
    event.stopPropagation();
    event.preventDefault();
    var fileList = document.getElementById("fileList");
    //对拖进来的多个文件创建图片、名称、进度条
    for(var i = 0; i < files.length; i++){
        var file = files[i];
        var li = document.createElement("li");
        var progressbar = document.createElement("div");
        var img = document.createElement("img");
        var name = document.createElement("p");
        progressbar.className = "progressBar";

        img.src = "img/img.jpg";
        img.width = 32;
        img.height = 32;
        name.innerHTML = file.name;
        //根据文件后缀选择图片
        li.appendChild(img);
        li.appendChild(name);
        li.appendChild(progressbar);
        fileList.appendChild(li);
        //上传文件
        uploadFile(file, progressbar);
    }
}

//上传文件
function uploadFile(file,progressbar){
    var xhr = new XMLHttpRequest();
    var upload = xhr.upload;

    var p = document.createElement("p");
    p.textContent = "0%";
    progressbar.appendChild(p);
    upload.progressbar = progressbar;

    upload.addEventListener("progress", uploadProgress, false);
    upload.addEventListener("load", uploadSucceed, false);
    upload.addEventListener("error", uploadError, false);

    //xhr.open("POST", "upload.jsp?fileName="+file.name);
    //xhr.overrideMimeType("application/octet-stream");
    //xhr.sendAsBinary(file.getAsBinary());
}
//上传过程
function uploadProgress(event)
{
    if (event.lengthComputable)
    {
        // 将进度换算成百分比
        var percentage = Math.round((event.loaded * 100) / event.total);
        console.log("percentage:" + percentage);
        if (percentage < 100)
        {
            event.target.progressbar.firstChild.style.width = (percentage*2) + "px";
            event.target.progressbar.firstChild.textContent = percentage + "%";
        }
    }
}
//上传成功，
function uploadSucceed(event)
{
    event.target.progressbar.firstChild.style.width = "30px";
    event.target.progressbar.firstChild.textContent = "100%";
}
//上传失败，弹出警告
function uploadError(error)
{
    alert("error: " + error);
}

window.addEventListener("load",addFileListener);

