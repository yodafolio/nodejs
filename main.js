var http = require('http');
var fs = require('fs');
var url = require('url');
var log = console.log;

var app = http.createServer((req, res) => {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    log(queryData.id);
        if(_url === '/') {
            title = 'welcome';
        }
        if(_url === '/favicon.ico') {
            res.writeHead(404);
            res.end();
            return;
        }
        fs.readFile(`data/${queryData.id}`, 'utf-8', (err, data) => {
            var description = data;
            var template = `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>
            ${description};
            </p>
            </body>
            </html>
            `;
            res.writeHead(200);
            res.end(template);
        });
});
app.listen(3000);