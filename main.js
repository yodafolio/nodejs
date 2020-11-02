var http = require('http');
var fs = require('fs');
var url = require('url');
var log = console.log;

var templateHTML = (title, list, body) => {
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
    </body>
    </html>
    `
}

var templateList = (filelist) => {
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i = i + 1;
    }
    list = list + '</ul>';
    return list
}

var app = http.createServer((req, res) => {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/') {
        if(queryData.id === undefined) {

            fs.readdir('./data', (err, filelist) => {
                console.log(filelist);
                var list = templateList(filelist);
                var title = 'hello';
                var description = 'hollo, nodejs';
                var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                res.writeHead(200);
                res.end(template);
            })
        } else {
            fs.readdir('./data', (err, filelist) => {
                console.log(filelist);
                var list = templateList(filelist);
                fs.readFile(`data/${queryData.id}`, 'utf-8', (err, data) => {
                    var description = data;
                    var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                    res.writeHead(200);
                    res.end(template);
                });
            })
        }
    } else if(pathname === '/create') {
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
            <form action="" method="">
            <p>
                <input type="text" name="title" placeholeder="title">
            </p>
            <p>
                <textarea></textarea>
            </p>
            <p>
                <input type="submit"value="전송">
            </p>
            </form>
            </p>
            </body>
            </html>
            `;
            res.writeHead(200);
            res.end(template);
    } else if(pathname === '/update') {
        res.writeHead(200);
        res.end('update');
    } else if(pathname === '/delete') {
        res.writeHead(200);
        res.end('delete');
    } else {
        res.writeHead(404);
        res.end('not found');
    }

});
app.listen(3000);