// server.js

var runner = require('../ojclient/app.js').runner;
var fs = require('fs');

var express = require('express');
var app = express();
var url = require('url');
var path = require('path');

//引入body-parser，允许从请求中获得参数
app.use(require('body-parser').urlencoded({extended: true}))
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
});
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

app.post('/IDE/handle', function (req,res) {
    console.log("IN");
    var content = req.body.Name;
    console.log(content);
    res.send(content);
    res.end();
});
app.listen(8080);
console.log('8080 is the magic port');