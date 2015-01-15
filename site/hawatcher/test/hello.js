var http = require('http');
var os = require('os');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World from '+os.hostname()+'\n');
}).listen(23333);

console.log('Server running at http://0.0.0.0:23333/');
