/**
 * Created by YBH on 2015/2/26.
 */
var index;

$("#circle").bind("click",function(){
    parent.addCircle(parent.generateID(),"",50,50,50);
});
$("#square").bind("click",function(){
    parent.addSquare(parent.generateID(),"",50,50,50);
});
$("#rectangle").bind("click",function(){
    parent.addRectangle(parent.generateID(),"",80,40,50,50);
});
$("#triangle").bind("click",function(){
    parent.addTriangle(parent.generateID(),"",50,50,50);
});
$("#array").bind("click",function(){
    parent.addArray(parent.generateID(),[" "," "," "," "," "]);
});
$("#stack").bind("click",function(){
    parent.addStack(parent.generateID(),[" "," "," "," "," "]);
});
$("#queue").bind("click",function(){
    parent.addQueue(parent.generateID(),[" "," "," "," "," "]);
});
$("#operation").bind("click",function(){
    parent.addOperation(parent.generateID(),[" "]);
});
$("#if").bind("click",function(){
    parent.addIf(parent.generateID(),[" "," "," "]);
});
$("#while").bind("click",function(){
    parent.addWhile(parent.generateID(),[" "," "]);
});
$("#dowhile").bind("click",function(){
    parent.addDoWhile(parent.generateID(),[" "," "]);
});


$(".graphButton").bind("click",function(){
    parent.changeToGraphMode();
    parent.layer.close(index);
});

$("#close").bind("click",function(){
    parent.layer.close(index);
});

window.onload = function(){
    index = parent.layer.getFrameIndex(window.name);
}