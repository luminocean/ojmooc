/**
 * 解析执行请求，获取请求报文中的json对象
 * @param req http传来的请求对象
 * @param callback
 */
exports.parseRequest = function(req, callback){
    //只处理json类型的POST请求
    if( req.method !== 'POST' ||
        req.headers['content-type'] !== 'application/json')
        return;

    //如果已经解析过了就直接返回
    if(req.body){
        return callback(null, req.body);
    }

    var dataBuf = '';
    req.on('data',function(chunk){
        req.body = {"listeningData":"true"};
        dataBuf += chunk;
    });
    req.on('end',function(){
        var data = dataBuf.toString();
        try{
            var body = JSON.parse(data);
            req.body = body;
            callback(null, body);
        }catch(err){
            req.body = {"parseErr":err};
            callback(err);
        }
    });
};