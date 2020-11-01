var http = require('http');

var app = http.createServer((req, res) => {
    console.log('hello');
});

app.listen(3000);