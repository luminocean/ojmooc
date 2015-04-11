/**
 * Created by savio on 2015/4/7.
 */
var express = require('express');
var router = express.Router();
var dbr = require('../../ojclient/app.js').debugger;
var runner = require('../../ojclient/app.js').runner;

var IP = "121.42.155.75";
var runPort = "8080";
var debugPort = "8081";
var message = "";

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

    var runInfo;
    message = "程序运行结束！";
    runner.run(code, language, params, function (err, result) {
        if(err){
            res.send(errInfo(err));
            return console.log(err);
        }
        runInfo = {
            "result": result,
            "message": message
        };
        res.send(runInfo);
        res.end();
    });
});


router.post('/debugBegin', function (req, res) {

    var srcCode = req.body.code;
    var srcType = req.body.language;
    var inputData = req.body.params;
    var bplines = [];
    if(req.body["bps[]"]) {
        var bps = req.body["bps[]"];
        for (var i = 0; i < bps.length; i++) {
            bplines.push(parseInt(bps[i]) + 1);
        }
    }

    dbr.launchDebug(srcCode, srcType, inputData, bplines, function (err, debugId, finish, breakPoint, stdout, locals) {
        if(err){
            res.send(errInfo(err));
            return console.log(err);
        }
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
    var variables = new Array();
    if(typeof (req.body["variables[]"]) == "string"){
        variables.push(req.body["variables[]"]);
    }else{
        variables = req.body["variables[]"];
    }
    //console.log(variables);
    dbr.printVal(debugId, variables, function (err, values) {
        if(err){
            res.send(errInfo(err));
            return console.log(err);
        }
        console.log(values);
        res.send(values);
    });
});

router.post('/setBreakpointToServer', function (req, res) {
    var debugId = req.body.debugId;
    var lineNum = req.body.lineNum;
    var breakPoints = [];
    breakPoints.push(lineNum);
    console.log("set:"+breakPoints);
    dbr.breakPoint(debugId, breakPoints, function (err, breakPointNum) {
        if(err){
            res.send(errInfo(err));
            return console.log(err);
        }
        res.send(breakPointNum);
    });
});

router.post('/clearBreakpointToServer', function (req, res) {
    var debugId = req.body.debugId;
    var lineNum = req.body.lineNum;
    var breakPoints = [];
    breakPoints.push(lineNum);
    console.log("clear:"+breakPoints);
    dbr.removeBreakPoint(debugId, breakPoints, function (err, breakPointNum) {
        if(err){
            res.send(errInfo(err));
            return console.log(err);
        }
        res.send(breakPointNum);
    });
});


router.post('/stepInto', function (req, res) {
    var debugId = req.body.debugId;
    dbr.stepInto(debugId, function (err, finish, breakPoint, stdout, locals) {
        if(err){
            res.send(errInfo(err));
            return console.log(err);
        }
        var stepInto = {
            "finish": finish,
            "breakPoint": breakPoint,
            "stdout": stdout,
            "locals": locals
        };
        res.send(stepInto);
    });
});

router.post('/stepOver', function (req, res) {
    var debugId = req.body.debugId;
    dbr.stepOver(debugId, function (err, finish, breakPoint, stdout, locals) {
        if(err){
            res.send(errInfo(err));
            return console.log(err);
        }
        var stepOver = {
            "finish": finish,
            "breakPoint": breakPoint,
            "stdout": stdout,
            "locals": locals
        };
        res.send(stepOver);

    });

});

router.post('/continue', function (req, res) {
    var debugId = req.body.debugId;
    dbr.continue(debugId, function (err, finish, breakPoint, stdout, locals) {
        if(err){
            res.send(errInfo(err));
            return console.log(err);
        }
        var moveOn = {
            "finish": finish,
            "breakPoint": breakPoint,
            "stdout": stdout,
            "locals": locals
        };
        res.send(moveOn);
    });

});

router.post('/exit', function (req, res) {
    var debugId = req.body.debugId;
    dbr.exit(debugId, function (err, debugId) {
        if(err){
            res.send(errInfo(err));
            return console.log(err);
        }
        res.send(debugId);
    });
});

module.exports = router;


function errInfo(err){
        var str = err.toString();
        str = str.replace(/[Error: Error: Command failed: \/tmp\/ojrunner\/repo\/src\/[0-9]+.cpp:/g, "");
        str = "错误信息:\r\n"+str;
        var errInfo = {
            "err":str
        }
    return errInfo;
}

//function errInfo_debug(err){
//    var str = err.toString();
//    str = str.replace(/Error: Error: Command failed: \/tmp\/ojdebugg:/g, "");
//    str = "错误信息:\r\n"+str;
//    var errInfo = {
//        "err":str
//    }
//    return errInfo;
//}

