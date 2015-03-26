var index;

//鼠标移入大小选择框，加深边框颜色，显示下拉条
$("#sizeSelect").bind("mouseenter",function(){
    $("#sizeSelect").css("border-color","black");
    $("#sizeList").css("display","table-caption");
});
//鼠标移出大小选择框，减淡边框颜色，隐藏下拉条
$("#sizeSelect").bind("mouseleave",function(){
    $("#sizeSelect").css("border-color","blanchedalmond");
    $("#sizeList").css("display","none");
});

$(".size-value").bind("mouseenter",function(e){
    $(e.target).css("background-color","#b9def0");
});
$(".size-value").bind("mouseleave",function(e){
    $(e.target).css("background-color","white");
});

$(".size-value").bind("click",function(e){
    e.target.style.backgroundColor = "#b9def0";
    var size = $(e.target).html();
    $("#size").html(size);
    $("#sizeList").css("display","none");
    parent.setPenSize(size);
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
        parent.setPenColor($("#color").css("background-color"));
        return false;
    },
    onChange: function (hsb, hex, rgb) {
        $('#color').css('backgroundColor', '#' + hex);
    }
});


$("#close").bind("click",function(){
    parent.layer.close(index);
});

window.onload = function(){
    index = parent.layer.getFrameIndex(window.name);
    $("#color").css("background-color",parent.getPenColor());
    $("#size").html(parent.getPenSize());
}