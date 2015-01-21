var parser = require('./gdb_parser');

var line = '~"$1 = 15"\n';
var val = parser.parsePrintVal(line);
console.log(val);