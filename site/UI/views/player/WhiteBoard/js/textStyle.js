var index;

//鼠标移入字体选择框,加深边框颜色，显示下拉条
$("#fontSelect").bind("mouseenter",function(){
    $("#fontSelect").css("border-color","black");
    $("#fontList").css("display","table-caption");
});
//鼠标移出字体选择框，减淡边框颜色，隐藏下拉条
$("#fontSelect").bind("mouseleave",function(){
    $("#fontSelect").css("border-color","blanchedalmond");
    $("#fontList").css("display","none");
});
//鼠标移入字体大小选择框，加深边框颜色，显示下拉条
$("#sizeSelect").bind("mouseenter",function(){
    $("#sizeSelect").css("border-color","black");
    $("#sizeList").css("display","table-caption");
});
//鼠标移出字体大小选择框，减淡边框颜色，隐藏下拉条
$("#sizeSelect").bind("mouseleave",function(){
    $("#sizeSelect").css("border-color","blanchedalmond");
    $("#sizeList").css("display","none");
});
//改变鼠标移入效果
$(".font-value").bind("mouseenter",function(e){
    $(e.target).css("background-color","#b9def0");
});
$(".font-value").bind("mouseleave",function(e){
    $(e.target).css("background-color","white");
});
$(".size-value").bind("mouseenter",function(e){
    $(e.target).css("background-color","#b9def0");
});
$(".size-value").bind("mouseleave",function(e){
    $(e.target).css("background-color","white");
});

//选择字体，大小
$(".font-value").bind("click",function(e){
    e.target.style.backgroundColor = "#b9def0";
    var font = $(e.target).html();
    $("#font").html(font);
    $("#fontList").css("display","none");
    parent.setTextFont(font);
});
$(".size-value").bind("click",function(e){
    e.target.style.backgroundColor = "#b9def0";
    var size = $(e.target).html();
    $("#size").html(size);
    $("#sizeList").css("display","none");
    parent.setTextSize(size);
});

//关闭按钮
$("#close").bind("click",function(){
    parent.layer.close(index);
});

$("#color").ColorPicker({
    color:"#000000",
    onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        $(colpkr).css("left","44px");
        $(colpkr).css("top","24px");
        return false;
    },
    onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        parent.setTextColor($("#color").css("background-color"));
        return false;
    },
    onChange: function (hsb, hex, rgb) {
        $('#color').css('backgroundColor', '#' + hex);
    }
});


window.onload = function(){
    index = parent.layer.getFrameIndex(window.name);
    $("#color").css("background-color",parent.getTextColor());
    $("#font").html(parent.getTextFont());
    $("#size").html(parent.getTextSize());
}



