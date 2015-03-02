/**
 * Created by YBH on 2015/2/26.
 */
var type = ["line","text","circle","square","rectangle","triangle","array","stack","queue","if","while","dowhile"];
//弹出说明
$("#aboutButton").bind("click",function(){

});


$("#addButton").bind("click",function(){
    quickAdd($("#add").val());
});
$("#add").bind("keydown",function(e){
    if(e.keyCode == 13){
        quickAdd($("#add").val());
    }
});

//解析文本，添加图形
function quickAdd(string){
    var arr = new Array();
    arr = string.split(" ");
    switch(arr[0]){
        case type[0]:                                   //line
            var pointList = new Array();
            if(arr.length <= 1){
                pointList.push([10,10],[50,10]);
                quickAddLine(pointList);
            }
            else{
                for(var i = 1; i < arr.length; i++){
                    if(!isPoint(arr[i])){
                        console.log("error");
                        break;
                    }
                    stringPoint = arr[i].split(",");
                    var point = new Array();
                    point[0] = parseInt(stringPoint[0]);
                    point[1] = parseInt(stringPoint[1]);
                    pointList.push(point);
                }
                quickAddLine(pointList);
            }
            break;

        case type[1]:                                       //text
            if(arr.length == 1){
                addText("text",10,10);
            }
            else if(arr.length == 2){
                addText(arr[1],10,10);
            }
            else if(arr.length == 3){
                if(!isPoint(arr[2])){
                    console.log("error");
                    break;
                }
                stringPoint = arr[2].split(",");
                var point = new Array();
                point[0] = parseInt(stringPoint[0]);
                point[1] = parseInt(stringPoint[1]);
                addText(arr[1],point[0],point[1]);
            }
            else{
                console.log("error");
                break;
            }
            break;

        case type[2]:                                   //circle
            if(arr.length == 1){
                addCircle(50,50,50);
            }
            else if(arr.length == 2){
                var r = parseInt(arr[1]);
                if(isNaN(r)||(r <= 0)){
                    console.log("error");
                    break;
                }
                addCircle(r,50,50);
            }
            else if(arr.length == 3){
                var r = parseInt(arr[1]);
                if(isNaN(r)||(r <= 0)){
                    console.log("error");
                    break;
                }
                if(!isPoint(arr[2])){
                    console.log("error");
                    break;
                }
                stringPoint = arr[2].split(",");
                var point = new Array();
                point[0] = parseInt(stringPoint[0]);
                point[1] = parseInt(stringPoint[1]);
                addCircle(r,point[0],point[1]);
            }
            break;

        case type[3]:                                          //square
            if(arr.length == 1){
                addSquare(50,50,50);
            }
            else if(arr.length == 2){
                var r = parseInt(arr[1]);
                if(isNaN(r)||(r <= 0)){
                    console.log("error");
                    break;
                }
                addSquare(r,50,50);
            }
            else if(arr.length == 3){
                var r = parseInt(arr[1]);
                if(isNaN(r)||(r <= 0)){
                    console.log("error");
                    break;
                }
                if(!isPoint(arr[2])){
                    console.log("error");
                    break;
                }
                stringPoint = arr[2].split(",");
                var point = new Array();
                point[0] = parseInt(stringPoint[0]);
                point[1] = parseInt(stringPoint[1]);
                addSquare(r,point[0],point[1]);
            }
            break;

        case type[4]:                                          //rectangle
            if(arr.length == 1){
                addRectangle(80,40,50,50);
            }
            else if(arr.length == 3){
                var w = parseInt(arr[1]);
                if(isNaN(w)||(w <= 0)){
                    console.log("error");
                    break;
                }
                var h = parseInt(arr[2]);
                if(isNaN(h)||(h <= 0)){
                    console.log("error");
                    break;
                }
                addRectangle(w,h,50,50);
            }
            else if(arr.length == 4){
                var w = parseInt(arr[1]);
                if(isNaN(w)||(w <= 0)){
                    console.log("error");
                    break;
                }
                var h = parseInt(arr[2]);
                if(isNaN(h)||(h <= 0)){
                    console.log("error");
                    break;
                }
                if(!isPoint(arr[3])){
                    console.log("error");
                    break;
                }
                stringPoint = arr[3].split(",");
                var point = new Array();
                point[0] = parseInt(stringPoint[0]);
                point[1] = parseInt(stringPoint[1]);
                addRectangle(w,h,point[0],point[1]);
            }
            break;

        case type[5]:                                                   //triangle
            if(arr.length == 1){
                addTriangle(50,50,50);
            }
            else if(arr.length == 2){
                var r = parseInt(arr[1]);
                if(isNaN(r)||(r <= 0)){
                    console.log("error");
                    break;
                }
                addTriangle(r,50,50);
            }
            else if(arr.length == 3){
                var r = parseInt(arr[1]);
                if(isNaN(r)||(r <= 0)){
                    console.log("error");
                    break;
                }
                if(!isPoint(arr[2])){
                    console.log("error");
                    break;
                }
                stringPoint = arr[2].split(",");
                var point = new Array();
                point[0] = parseInt(stringPoint[0]);
                point[1] = parseInt(stringPoint[1]);
                addTriangle(r,point[0],point[1]);
            }
            break;

        case type[6]:                                              //array
            if(arr.length == 1){
                addArray(["","","","",""]);
            }
            else if(arr.length == 2){
                var val = arr[1].split(",");
                addArray(val);
            }
            break;

        case type[7]:                                              //stack
            if(arr.length == 1){
                addStack(["","","","",""]);
            }
            else if(arr.length == 2){
                var val = arr[1].split(",");
                addStack(val);
            }
            break;

        case type[8]:                                              //queue
            if(arr.length == 1){
                addQueue(["","","","",""]);
            }
            else if(arr.length == 2){
                var val = arr[1].split(",");
                addQueue(val);
            }
            break;

        case type[9]:                                              //if
            if(arr.length == 1){
                addIf(["","",""]);
            }
            else if(arr.length == 2){
                var val = arr[1].split(",");
                addIf([arr[1],"",""]);
            }
            else if(arr.length == 3){
                var val = arr[1].split(",");
                addIf([arr[1],arr[2],""]);
            }
            else if(arr.length == 5){
                var val = arr[1].split(",");
                addIf([arr[1],arr[2],arr[4]]);
            }
            break;
        case type[10]:                                          //while
            if(arr.length == 1){
                addWhile(["",""]);
            }
            else if(arr.length == 2){
                var val = arr[1].split(",");
                addWhile([arr[1],""]);
            }
            else if(arr.length == 3){
                var val = arr[1].split(",");
                addWhile([arr[1],arr[2]]);
            }
            break;
        case type[11]:                                          //dowhile
            if(arr.length == 1){
                addDoWhile(["",""]);
            }
            else if(arr.length == 2){
                var val = arr[1].split(",");
                addDoWhile([arr[1],""]);
            }
            else if(arr.length == 3){
                var val = arr[1].split(",");
                addDoWhile([arr[1],arr[2]]);
            }
            break;
        default:
            alert("错误输入！");
            break;
    }
}

function isPoint(string){
    point = string.split(",");
    if((point.length <=1)||(point.length>=3)){
        return false;
    }
    if(isNaN(parseInt(point[0]))||isNaN(parseInt(point[1]))){
        return false;
    }
    return true;
}

