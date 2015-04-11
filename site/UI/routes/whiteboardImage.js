var express = require('express');
var Busboy = require('busboy');
var fs = require('fs');
var path = require('path');
var router = express.Router();


router.post('/upload',function(req,res){
    if (req.method === 'POST') {
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            id = generateID(filename);
            var saveTo = path.join(__dirname,"../upload/images/"+id);
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('finish', function() {
            res.writeHead(200, { 'Connection': 'close','Access-Control-Allow-Origin':'/' });
            res.write(id);
            res.end();

        });
        return req.pipe(busboy);
    }
});

router.post('/download',function(req,res){
    if (req.method === 'POST') {
        var buffer;
        req.on("data",function(chunk){
            buffer += chunk;
        });
        req.on("end",function(){
            var filename = buffer.split("undefined")[1];
            var filepath = path.join(__dirname,"../upload/images"+filename);
            fs.readFile(filepath,"base64",function(err,data){
                if(err){
                    console.log("err");
                }
                else{
                    res.writeHead(200, { 'Content-Type': 'image','Connection': 'close','Access-Control-Allow-Origin':'/' });
                    res.write(data);
                    res.end();
                }
            });
        });
    }
});

function generateID(filename){
    var time = new Date();
    var id = time.getTime().toString();
    return id+filename;
}

module.exports = router;