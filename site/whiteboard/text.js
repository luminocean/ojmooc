/**
 * Created by YBH on 2015/1/7.
 */
var zr; // 全局可用zrender对象
var domMain = document.getElementById('main');
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
    ["zrender","zrender/shape/Text"],
    function(zrender){
        zr = zrender.init(domMain);

        var Text = require('zrender/shape/Text');
        var shape = new Text({
            style: {
                text: 'Label',
                x: 100,
                y: 100,
                textFont: '14px Arial'
            }
        });
        zr.addShape(shape);
        zr.render();
    }
);
