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
var Rectangle;
var IsogonShape;
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
        "zrender/shape/Rectangle",
        "zrender/shape/Isogon",
        "zrender/shape/Image",
        "zrender/shape/BrokenLine"
    ],
    function(zrender){
        zr = zrender.init(graphBoard);

        Text = require("zrender/shape/Text");
        ImageShape = require('zrender/shape/Image');
        Circle = require("zrender/shape/Circle");
        Rectangle = require("zrender/shape/Rectangle");
        IsogonShape = require("zrender/shape/Isogon");
        Base = require("zrender/shape/Base");

        zr.render();
    }
);