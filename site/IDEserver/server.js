// server.js

var fs = require('fs');
var dbr = require('../ojclient/app.js').debugger;
var runner = require('../ojclient/app.js').runner;

var express = require('express');
var app = express();
var url = require('url');
var path = require('path');
var IP = "121.42.155.75";
var runPort = "8080";
var debugPort = "8081";

runner.setPort(runPort);
runner.setHost(IP);
dbr.setPort(debugPort);
dbr.setHost(IP);

/**
 * 引入body-parser模块，允许从请求中获取参数
 */
app.use(require('body-parser').urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/**
 * index page
 */
app.get('/', function (req, res) {
    var drinks = [
        {name: 'Bloody Mary', drunkness: 3},
        {name: 'Martini', drunkness: 5},
        {name: 'Scotch', drunkness: 10}
    ];
    var tagline = "Hello,World!";

    res.render('pages/index', {
        drinks: drinks,
        tagline: tagline
    });
});


/**
 * editor page
 */
app.get('/editor', function (req, res) {
    res.render('pages/editor');
});


/**
 * 应对客户端的ajax请求
 */
app.post('/editor/run', function (req, res) {
    var code = req.body.code;
    var language = req.body.language;
    var params = req.body.params;
    //console.log(language + params);
    runner.run(code, language, params, function (err, result, params, host) {
        if (err) return console.error(err);
        res.send(result);
        res.end();
    });
});


app.post('/editor/debugBegin', function (req, res) {
    var srcCode = req.body.code;
    var srcType = req.body.language;
    var inputData = req.body.params;
    var bps = req.body.bps;
    var bplines = [];
    for (var i = 0; i < bps.length; i++) {
        bplines.push(parseInt(bps[i]) + 1);
    }
    //console.log(srcType);
    //console.log(inputData);
    //console.log(bplines);
    dbr.launchDebug(srcCode, srcType, inputData, bplines, function (err, debugId, finish, breakPoint, stdout, locals) {
        if (err) return console.log(err);
        var debugInfo = {
            "debugId": debugId,
            "finish": finish,
            "breakPoint": breakPoint,
            "stdout": stdout,
            "locals": locals
        };
        //console.log("launch" + stdout);
        res.send(debugInfo);
    });
});

app.post('/editor/printVariables', function (req, res) {
    var debugId = req.body.debugId;
    var variables = req.body.variables;

    console.log("0"+variables);
    for (var key in variables) {
        dbr.printVal(debugId, key, function (err, value) {
            if (err)console.log(err);
            variables[key] = value;
            console.log("1"+key+variables[key]);
        });
    }
    console.log("2"+variables);
    res.send(variables);
});

app.post('/editor/setBreakpointToServer',function(req,res){
    var debugId = req.body.debugId;
    var lineNum = req.body.lineNum;

    console.log(lineNum);
});

app.post('/editor/stepInto', function (req, res) {
    var debugId = req.body.debugId;
    dbr.stepInto(debugId, function (err, finish, breakPoint, stdout, locals) {
        if (err) return console.log(err);
        var stepInto = {
            "finish": finish,
            "breakPoint": breakPoint,
            "stdout": stdout,
            "locals": locals
        };
        console.log("stepInto" + stdout);
        res.send(stepInto);
    });
});

app.post('/editor/stepOver', function (req, res) {
    var debugId = req.body.debugId;
    dbr.stepOver(debugId, function (err, finish, breakPoint, stdout, locals) {
        if (err) return console.log(err);
        var stepOver = {
            "finish": finish,
            "breakPoint": breakPoint,
            "stdout": stdout,
            "locals": locals
        };
        console.log(finish);
        res.send(stepOver);

    });

});

app.post('/editor/continue', function (req, res) {
    var debugId = req.body.debugId;
    dbr.continue(debugId, function (err, finish, breakPoint, stdout, locals) {
        if (err)return console.log(err);
        var moveOn = {
            "finish": finish,
            "breakPoint": breakPoint,
            "stdout": stdout,
            "locals": locals
        };
        console.log(stdout);
        res.send(moveOn);
    });

});

app.post('/editor/exit', function (req, res) {
    var debugId = req.body.debugId;
    dbr.exit(debugId, function (err, debugId) {
        if (err)return console.log(err);
    });
});

app.listen(8080);
console.log('8080 is the magic port');