var http = require('http');
var fs = require('fs');
var log = console.log;

var app = http.createServer((req, res) => {
    var url = req.url;
    if(url === '/') {
        url = '/index.html';
    }
    if(url === 'favicon.ico') {
        res.writeHead(404);
        res.end();
        return;
    }
    res.writeHead(200);
    var data = fs.readFileSync(__dirname + url);
    log(data)
    res.end(data);
});



app.listen(3000);