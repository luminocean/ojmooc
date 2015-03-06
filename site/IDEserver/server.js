// server.js
// load the things we need
var fs = require('fs');
var runner = require('../ojclient/app.js').runner;

var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');





// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render('pages/index', {
        drinks: drinks,
        tagline: tagline
    });
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.get('/begin', function (req,res) {
    runner.setPort(8080);
    var srcType = 'cpp';
    //读取测试用源文件
    var srcCode = fs.readFileSync('../ojclient/input_data/'+srcType+'_code','utf-8');
    //读取测试用数据
    var inputData = fs.readFileSync('../ojclient/input_data/'+srcType+'_data','utf-8');
    for(var i=0; i<5; i++){
        runner.run(srcCode,srcType,inputData,function(err,result,params,host) {
            if (err) return console.error(err);

            res.send(host+':\n'+result + JSON.stringify(params));
        });
    }
})

app.listen(8080);
console.log('8080 is the magic port');