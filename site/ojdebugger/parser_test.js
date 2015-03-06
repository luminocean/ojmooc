var parser = require('./core/parser');

var fs = require('fs');

fs.readFile('./program/template.txt',function(err,text){
    var result = parser.parseLocals(text.toString());
    console.log(result);
});
