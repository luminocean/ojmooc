/**
 * gdb封装模块
 */

var path = require('path');
var cp = require('child_process');
var parser = require('./parser');

//debugger对象
var dbr = {};
module.exports = dbr;

//临时计数器
var counter = 0;
//存放所有gdb进程的对象
var gdbMap = {};

/**
 * 开启debug
 * @param programName
 * @param breakLine
 * @param callback
 */
dbr.debug = function(programName,breakLine,callback){
    var programPath = path.join(__dirname,'../program',programName);

    var gdb = cp.spawn('gdb',['--interpreter=mi',programPath]);
    var data = '';
    gdb.stdout.on('data',function(chunk){
        data += chunk;
        //检查已获取数据的结尾，如果是(gdb)就表示一次输出已经完成，触发batch事件
        var tail = data.substr(data.length-7,7).toString();
        if(tail.match(/\(gdb\)\s*$/)){
            gdb.stdout.emit('batch',data);
            data = '';
        }
    });
    //读完一批数据出发batch事件，进行输出的处理操作
    gdb.stdout.on('batch',function(batch){
        console.log('read complete-----------------\n'+batch);
        console.log('-------------------------------\n');

        //直到解析到断点信息出现才回传信息，因为之前的都是无用信息
        var breakPointResult = parser.breakPoint(batch);
        if(!breakPointResult) return;

        counter++;
        gdbMap[counter] = gdb;

        var result = {
            "debugId":counter,
            "breakPoint":breakPointResult
        };

        callback(null, result);
    });

    gdb.stdin.write('break '+breakLine+'\n');
    gdb.stdin.write('r\n');
};

/**
 * 查值操作
 * @param debugId
 * @param valName
 * @param callback
 */
dbr.printVal = function(debugId,valName,callback){
    var gdb = gdbMap[debugId];
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    gdb.stdin.write('p '+valName+'\n');
    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log('read complete-----------------\n'+batch);
        console.log('-------------------------------\n');

        var result = parser.printVal(batch);
        callback(null, result.value);
    });
};