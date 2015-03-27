var url = require('url');

/**
 * 解析执行请求，获取请求报文中的操作和json对象
 * @param req http传来的请求对象
 * @param callback
 */
exports.parseRequest = function(req, callback){
    //只处理json类型的POST请求
    if( req.method !== 'POST' ||
        req.headers['content-type'] !== 'application/json')
        return;

    var requsetUrl = req.url;
    var pathName = url.parse(requsetUrl)["pathname"];
    if(!pathName || pathName.substr(0,1) !== '/'){
        return callback(new Error('无法解析请求的路径名：'+url));
    }

    var methodName = pathName.substring(1);

    //如果已经解析过了就直接返回
    if(req.body){
        return callback(null,{
            "methodName":methodName,
            "body":req.body
        });
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
            callback(null, {
                "methodName":methodName,
                "body":body
            });
        }catch(err){
            req.body = {"parseErr":err};
            callback(err);
        }
    });
};