/**
 * Created by YBH on 2015/2/26.
 */
var index;

$("#circle").bind("click",function(){
    parent.addCircle(50,50,50);
});
$("#square").bind("click",function(){
    parent.addSquare(50,50,50);
});
$("#rectangle").bind("click",function(){
    parent.addRectangle(80,40,50,50);
});
$("#triangle").bind("click",function(){
    parent.addTriangle(50,50,50);
});
$("#array").bind("click",function(){
    parent.addArray(["","","","",""]);
});
$("#stack").bind("click",function(){
    parent.addStack(["","","","",""]);
});
$("#queue").bind("click",function(){
    parent.addQueue(["","","","",""]);
});
$("#if").bind("click",function(){
    parent.addIf(["","",""]);
});
$("#while").bind("click",function(){
    parent.addWhile(["",""]);
});
$("#dowhile").bind("click",function(){
    parent.addDoWhile(["",""]);
});


$(".graphButton").bind("click",function(){
    parent.layer.close(index);
});

$("#close").bind("click",function(){
    parent.layer.close(index);
});

window.onload = function(){
    index = parent.layer.getFrameIndex(window.name);
}