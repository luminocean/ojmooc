var http = require("http");
var fs = require("fs");
var path = require("path");
var Busboy = require('busboy');

var id;

var uploadServer = http.createServer(function(req,res){
    if(req.url == "/upload"){
        if (req.method === 'POST') {
            var busboy = new Busboy({ headers: req.headers });
            busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                id = generateID(filename);
                var saveTo = path.join(__dirname,"./imgs/"+id);
                file.pipe(fs.createWriteStream(saveTo));
            });
            busboy.on('finish', function() {
                res.writeHead(200, { 'Connection': 'close','Access-Control-Allow-Origin':'http://localhost' });
                res.write(id);
                res.end();
            });
            return req.pipe(busboy);
        }
    }
    else if(req.url == "/download"){
        if (req.method === 'POST') {
            var buffer;
            req.on("data",function(chunk){
                buffer += chunk;
            });
            req.on("end",function(){
                var filename = buffer.split("undefined")[1];
                var filepath = path.join(__dirname,"./imgs/"+filename);
                fs.readFile(filepath,"base64",function(err,data){
                    if(err){
                        console.log("err");
                    }
                    else{
                        res.writeHead(200, { 'Content-Type': 'image/jpeg','Connection': 'close','Access-Control-Allow-Origin':'http://localhost' });
                        res.write(data);
                        res.end();
                    }
                });
            });
        }
    }
});
uploadServer.listen(1337,"127.0.0.1",function(){
    console.log("服务器已创建！ 127.0.0.1:1337");
});

function generateID(filename){
    var time = new Date();
    var id = time.getTime().toString();
    return id+filename;
}