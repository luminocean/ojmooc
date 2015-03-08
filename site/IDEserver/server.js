// server.js

//var runner = require('../ojclient/app.js').runner;
var express = require('express');
var app = express();

app.set('view engine', 'ejs');

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

// about page

app.get('/IDE', function (req,res) {
    //runner.setPort(8080);
    //runner.setHost('121.42.155.75');
    //var srcType = 'pas';
    //读取测试用源文件
    //var srcCode = fs.readFileSync('../ojclient/input_data/'+srcType+'_code','utf-8');
    //读取测试用数据
    //var inputData = fs.readFileSync('../ojclient/input_data/'+srcType+'_data','utf-8');
    //    runner.run(srcCode,srcType,inputData,function(err,result,params,host) {
    //        if (err) return console.error(err);

    //        res.render('pages/about',{
    //            result:result
    //        })
    //    });
    res.render('pages/IDE');
})

app.listen(8080);
console.log('8080 is the magic port');