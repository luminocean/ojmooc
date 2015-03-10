/**
 * Created by YBH on 2015/3/3.
 */
$("#graphBoard").bind("dragenter",function(event){
    event.stopPropagation();
    event.preventDefault();
});

$("#graphBoard").bind("dragover",function(event){
    event.stopPropagation();
    event.preventDefault();
});

//处理鼠标放下事件，添加图片
$("#graphBoard").bind("drop",function(event){
    event.stopPropagation();
    event.preventDefault();

    var files = event.dataTransfer.files;

});

