var path = require('path');
var cp = require('child_process');
var gdbParser = require('./util/gdb_parser');

//debugger对象
var dbr = {};
module.exports = dbr;

//临时计数器
var counter = 0;
var gdbMap = {};

/**
 * 开启debug
 * @param programPath
 * @param breakLine
 * @param callback
 */
dbr.debug = function(programName,breakLine,callback){
    var programPath = path.join(__dirname,'./program',programName);

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
        console.log('-------------------------------\n')
    });

    gdb.stdin.write('break '+breakLine+'\n');
    gdb.stdin.write('r\n');

    counter++;
    gdbMap[counter] = gdb;
    callback(null, counter);
};

dbr.printVal = function(debugId,valName,callback){
    var gdb = gdbMap[debugId];
    if(gdb){
        gdb.stdin.write('p '+valName+'\n');
    }
    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(batch);
        var outputObj = gdbParser.parseGdbOutputText(batch);
        callback(null,outputObj.printVal);
    });
}