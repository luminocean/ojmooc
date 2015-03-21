// server.js
var runner = require('../ojclient/app.js').runner;
var express = require('express');
var app = express();
var url = require('url');
var path = require('path');

/**
 * 引入body-parser模块，允许从请求中获取参数
 */
app.use(require('body-parser').urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/**
 * index page
 */
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


/**
 * IDE page
 */
app.get('/IDE', function (req,res) {
    res.render('pages/IDE');
});


/**
 * 应对客户端的ajax请求
 */
app.post('/IDE/handle', function (req,res) {
    runner.setPort(8080);
    runner.setHost('121.42.155.75');

    var code = req.body.code;
    var language = req.body.language;
    var params = req.body.params;

    runner.run(code,language,params,function(err,result,params,host) {
        if (err) return console.error(err);
        res.send(result);
        res.end();
    });
});

app.listen(8080);
console.log('8080 is the magic port');