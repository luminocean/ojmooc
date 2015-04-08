/**
 * Created by savio on 2015/4/7.
 */
var express = require('express');
var router = express.Router();
var dbr = require('../../ojclient/app.js').debugger;
var runner = require('../../ojclient/app.js').runner;

var express = require('express');
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
 * 应对客户端的ajax请求
 */
router.post('/run', function (req, res) {
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


router.post('/debugBegin', function (req, res) {
    var srcCode = req.body.code;
    var srcType = req.body.language;
    var inputData = req.body.params;
    var bps = req.body.bps;
    var bplines = [];
    for (var i = 0; i < bps.length; i++) {
        bplines.push(parseInt(bps[i]) + 1);
    }
    dbr.launchDebug(srcCode, srcType, inputData, bplines, function (err, debugId, finish, breakPoint, stdout, locals) {
        if (err) return console.log(err);
        var debugInfo = {
            "debugId": debugId,
            "finish": finish,
            "breakPoint": breakPoint,
            "stdout": stdout,
            "locals": locals
        };
        res.send(debugInfo);
    });
});

router.post('/printVariables', function (req, res) {
    var debugId = req.body.debugId;
    var variables = req.body.variables;

    dbr.printVal(debugId, variables, function (err, values) {
        res.send(values);
    });

});

router.post('/setBreakpointToServer', function (req, res) {
    var debugId = req.body.debugId;
    var lineNum = req.body.lineNum;
    var breakPoints = [];
    breakPoints.push(lineNum);

    dbr.breakPoint(debugId, breakPoints, function (err, breakPointNum) {
        if (err)console.log(err);
        res.send(breakPointNum);
    });
});

router.post('/clearBreakpointToServer"', function (req, res) {
    var debugId = req.body.debugId;
    var lineNum = req.body.lineNum;
    var breakPoints = [];
    breakPoints.push(lineNum);

    dbr.breakPoint(debugId, breakPoints, function (err, breakPointNum) {
        if (err)console.log(err);
        res.send(breakPointNum);
    });
});


router.post('/stepInto', function (req, res) {
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

router.post('/stepOver', function (req, res) {
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

router.post('/continue', function (req, res) {
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

router.post('/exit', function (req, res) {
    var debugId = req.body.debugId;
    dbr.exit(debugId, function (err, debugId) {
        if (err)return console.log(err);
    });
});

module.exports = router;
