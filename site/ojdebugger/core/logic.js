var dbr = require('./debugger');
var parser = require('./parser');

var logic = {};
module.exports = logic;

/**
 * 处理查值请求
 * @param param
 * @param callback
 */
logic.printVal = function(param,callback){
    var debugId = param.debugId;
    var valName = param.valName;
    dbr.printVal(debugId,valName,function(err,result){
        if(err) return callback(err);

        var val = parser.parsePrintVal(result);
        callback(null, {"printVal":val});
    });
};

/**
 * 处理debug请求
 * @param param debug请求参数
 * @param callback 处理完成后的回调函数
 */
logic.debug = function(param,callback){
    var programName = param.programName;
    var breakLine  = param.breakLine;

    dbr.debug(programName,breakLine,function(err,result){
        if(err) return callback(err);

        callback(null, {"debugId":result});
    });
};