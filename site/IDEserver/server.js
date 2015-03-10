// server.js

var runner = require('../ojclient/app.js').runner;
var fs = require('fs');

var express = require('express');
var app = express();
var url = require('url');
var path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// index page
app.get('/', function(req, res) {
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Hello,World!";

    res.render('pages/index', {
        drinks: drinks,
        tagline: tagline
    });
});

// IDE page

app.get('/IDE', function (req,res) {
    res.render('pages/IDE');
})
//    runner.setPort(8080);
//    runner.setHost('121.42.155.75');
//    var srcType = 'pas';
//    //读取测试用源文件
//    var srcCode = fs.readFileSync('../ojclient/input_data/'+srcType+'_code','utf-8');
//    //读取测试用数据
//    var inputData = fs.readFileSync('../ojclient/input_data/'+srcType+'_data','utf-8');
//        runner.run(srcCode,srcType,inputData,function(err,result,params,host) {
//            if (err) return console.error(err);
//
//            res.render('pages/IDE',{
//                result:result
//            })
//        });

app.get('/IDE/handle', function (req,res) {
    var content = req.query.code;
    console.log(content);
    res.send(content);
})
app.listen(8080);
console.log('8080 is the magic port');