/**
 * gdb封装模块
 */

var path = require('path');
var cp = require('child_process');
var parser = require('./parser');

//debugger对象
var dbr = {};
module.exports = dbr;

//gdb进程计数器
var counter = 0;
//存放所有gdb进程的对象
var gdbMap = {};

/**
 * 开启debug
 * @param programName
 * @param callback
 */
dbr.debug = function(programName,callback){
    var programPath = path.join(__dirname,'../program',programName);

    var gdb = cp.spawn('gdb',['--interpreter=mi',programPath]);
    var data = '';

    gdb.stdout.on('data',function(chunk){
        data += chunk;

        //在读到的gdb输出中检索(gdb)分隔标记，每个标记前面的数据都是一个batch
        var batchData = data.match(/([\s\S]*?)\(gdb\)\s*/);
        while(batchData){
            //发送batch事件与数据
            gdb.stdout.emit('batch',batchData[0]);

            //把发掉的数据去除，再检索还有没有batch
            data = data.replace(/[\s\S]*?\(gdb\)\s*/,'');
            batchData = data.match(/([\s\S]*?)\(gdb\)/);
        }
    });

    //读完一批数据出发batch事件，进行输出的处理操作
    gdb.stdout.on('batch',function(batch){
        //console.log('read complete-----------------\n'+batch);
        //console.log('-------------------------------\n');

        console.log(" DEBUG resolve");

        counter++;
        gdbMap[counter] = gdb;
        var result = {"debugId":counter};

        callback(null, result);
    });
};

/**
 * 添加断点操作
 * @param debugId
 * @param breakLines
 * @param callback
 */
dbr.breakPoint = function(debugId,breakLines,callback){
    var gdb = gdbMap[debugId];
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    var received = 0;

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        //console.log('read complete-----------------\n'+batch);
        //console.log('-------------------------------\n');

        console.log(debugId+" BP resolve");

        received++;
        if(received === breakLines.length){
            callback(null,{"breakPoint":breakLines.length});
        }
    });

    //加入断点
    if(!breakLines || breakLines.length==0) {
        callback(null, {"breakPoint": 0});
    }else{
        breakLines.forEach(function(lineNum){
            gdb.stdin.write('break '+lineNum+'\n');
        });
    }
};

/**
 * gdb执行操作
 * @param debugId
 * @param callback
 * @returns {*}
 */
dbr.run = function(debugId,callback){
    var gdb = gdbMap[debugId];
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(debugId+" RUN resolve");

        console.log('read complete-----------------\n'+batch);
        console.log('-------------------------------\n');

        runHandler(batch,callback);
    });

    //开始执行gdb
    gdb.stdin.write('r \n');
};

dbr.continue = function(debugId,callback){
    var gdb = gdbMap[debugId];
    if(!gdb)
        return callback(new Error('找不到debugId '+debugId+' 对应的进程'));

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(debugId+" CONTINUE resolve");
        console.log('read complete-----------------\n'+batch);
        console.log('-------------------------------\n');

        runHandler(batch,callback);
    });

    //继续gdb
    gdb.stdin.write('c \n');
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

    gdb.stdout.removeAllListeners('batch').on('batch',function(batch){
        console.log(debugId+' PRINT resolve');
        console.log('read complete-----------------\n'+batch);
        console.log('-------------------------------\n');

        var result = parser.parsePrintVal(batch);
        callback(null, result.value);
    });

    gdb.stdin.write('p '+valName+'\n');
};


/**
 * [测试用]执行套装，给定程序名一直执行到断点处
 */
dbr.suit = function(programName,breakLines,callback){
    //开启debug
    dbr.debug(programName,function(err,result){
        if(err) return callback(err);

        var debugId = result.debugId;
        //插入断点
        dbr.breakPoint(debugId,breakLines,function(err){
            if(err) return callback(err);

            //执行程序
            dbr.run(debugId,function(err,result){
                if(err) return callback(err);

                callback(null,{
                    "debugId":debugId,
                    "output":result
                });
            });
        });
    });
};

/**
 * 处理运行数据
 * @param batch
 * @param callback
 * @returns {*}
 */
function runHandler(batch,callback){
    //console.log('read complete-----------------\n'+batch);
    //console.log('-------------------------------\n');

    //如果到达了断点则返回断点信息
    var breakPointResult = parser.parseStopPoint(batch);
    if(breakPointResult)
        return callback(null, breakPointResult);

    //如果运行结束则返回结束信息
    var exitResult = parser.parseExit(batch);
    if(exitResult)
        return callback(null, exitResult);
}