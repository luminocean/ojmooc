var fs = require('fs');
var reportRepo = './report';

/**
 * 解析shell内置time命令返回的文件内容，解析出各个时间，以秒的形式返回
 * @param programName 被生成执行报告的程序名
 * @param callback 返回解析结果的回调函数
 */
exports.readReportParams = function(programName, callback){
    fs.readFile(reportRepo+"/"+programName+".txt", function(err, data){
        if(err) return callback(err, null);

        var params = {};
        var report = data.toString();
        var lines = report.split("\n");

        for(var i=0; i<lines.length; i++){
            var line = lines[i];
            if(line){
                var parts = line.split(" ");
                if( parts.length == 2 ){
                    //设置key/value对
                    //前三行是时间，做转换
                    if( i<3 )
                        params[parts[0]] = convertToSeconds(parts[1]);
                    else
                        //后面的就直接赋值
                        params[parts[0]] = parts[1];
                }
            }
        }

        callback(null, params);
    });
};

/**
 * 准备临时文件存放需要的目录，避免找不到目录而出错
 * 注意本方法调用了同步方法，请不要反复执行，会产生性能问题
 * 另外，如果将内存挂载到tmp上可以提高读写性能。可以使执行config/mount.sh完成挂载
 */
exports.prepareDir = function(){
    //获取各临时目录
    var dirs = config.repo.dir;
    for(var key in dirs){
        //跳过继承属性
        if( !dirs.hasOwnProperty(key) ) continue;

        var dir = '.'+dirs[key];
        if( !fs.existsSync(dir) ){
            fs.mkdirSync(dir);
        }
    }
};

function convertToSeconds(timeStr){
    if(!timeStr) return;

    var pieces = timeStr.match(/([0-9]*)m([0-9.]*)s/);
    if(pieces.length != 3) return;

    var min = parseFloat(pieces[1]);
    var sec = parseFloat(pieces[2]);
    return min*60+sec;
}