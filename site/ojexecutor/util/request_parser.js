/**
 * 解析执行请求
 * @param req http传来的请求对象
 * @param callback
 */
exports.parseRequest = function(req, callback){
    //只处理json类型的POST请求
    if( req.method !== 'POST' ||
        req.headers['content-type'] !== 'application/json')
        return;

    var dataBuf = '';
    req.on('data',function(chunk){
        dataBuf += chunk;
    });
    req.on('end',function(){
        var data = dataBuf.toString();
        try{
            var body = JSON.parse(data);
            callback(null, body);
        }catch(err){
            callback(err);
        }
    });
};