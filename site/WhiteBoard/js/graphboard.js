/**
 * Created by YBH on 2015/1/15.
 */
//var graphBoardStates = {
//    free:"free",
//    text:"text",
//    graph:"graph"
//}

//graphBoardState = graphBoardStates.free;

var zr;
var graphBoard = $("#graphBoard")[0];
var Base;
var Text;
var Circle;
var ImageShape;

require.config({
    packages: [
        {
            name: 'zrender',
            location: './zrender/src',
            main: 'zrender'
        }
    ]
});


require(
    [
        "zrender",
        "zrender/shape/Base",
        "zrender/shape/Text",
        "zrender/shape/Circle",
        "zrender/shape/Image",
        "zrender/shape/BrokenLine"
    ],
    function(zrender){
        zr = zrender.init(graphBoard);

        Text = require("zrender/shape/Text");
        ImageShape = require('zrender/shape/Image');
        Circle = require("zrender/shape/Circle");
        Base = require("zrender/shape/Base");


        //var BrokenLineShape = require('zrender/shape/BrokenLine');
        //zr.addShape(new BrokenLineShape({
        //    style : {
        //        pointList : [[10, 10], [60, 100], [148, 130], [250, 40], [446, 100]],
        //        lineWidth : 3,
        //        text : 'brokenLine'
        //    },
        //    draggable:true
        //}));



        addText("text",100,100);
        //addArray();
        //addCircle();
        //addStack();
        //addQueue();
        //addImage();

        zr.render();
    }
);





//function changeToGraphBoard(){
//    $("#drawBoard")[0].style.zIndex = 1;
//    $("#graphBoard")[0].style.zIndex = 2;
//}