var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./template/template.js');

var app = http.createServer((req, res) => {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/') {
        if(queryData.id === undefined) {
            fs.readdir('./data', (err, filelist) => {
                var list = template.list(filelist);
                var title = 'hello';
                var description = 'hollo, nodejs';
                var html = template.HTML(title, list, `<h2>${title}</h2><p>${description}</p>`, '<a href="/create">create</a>');
                res.writeHead(200);
                res.end(html);
            })
        } else {
            fs.readdir('./data', (err, filelist) => {
                fs.readFile(`data/${queryData.id}`, 'utf-8', (err, data) => {
                    var list = template.list(filelist);
                    var description = data;
                    var html = template.HTML(title, list,
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${title}">update</a>
                        <form action="/delete_proccess" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>
                        `);
                    res.writeHead(200);
                    res.end(html);
                });
            });
        }
    } else if(pathname === '/create') {
        fs.readdir('./data', (err, filelist) => {
            var title = "WEB - create";
            var list = template.list(filelist);
            var html = template.HTML(title, list,
            `
            <form action="http://localhost:3000/create_process" method="post">
                <p>
                    <input type="text" name="title" placeholeder="title">
                </p>
                <p>
                    <textarea name="description"></textarea>
                </p>
                <p>
                    <input type="submit"value="전송">
                </p>
            </form>
            `);
            res.writeHead(200);
            res.end(html);
        });
    } else if(pathname === '/create_process') {
        var body = '';
        req.on('data', data => {
            body = body + data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            fs.writeFile(`data/${title}`, description, 'utf-8', err => {
                res.writeHead(302, {
                    'Location': `/?id=${title}`
                });
                res.end('success');
            });
        })
    } else if(pathname === '/update') {
        fs.readdir('./data', (err, filelist) => {
            fs.readFile(`data/${queryData.id}`, 'utf-8', (err, data) => {
                var title = queryData.id;
                var list = template.list(filelist);
                var description = data;
                var html = template.HTML(title, list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p>
                            <input type="text" name="title" placeholeder="title" value="${title}">
                        </p>
                        <p>
                            <textarea name="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit"value="전송">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                res.writeHead(200);
                res.end(html);
            });
        });
    } else if(pathname === '/update_process') {
        var body = '';
        req.on('data', data => {
            body = body + data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, err => {
                fs.writeFile(`data/${title}`, description, 'utf-8', err => {
                    res.writeHead(302, {
                        'Location': `/?id=${title}`
                    });
                    res.end();
                });
            });
        });
    } else if(pathname === '/delete_proccess') {
        var body = '';
        req.on('data', data => {
            body = body + data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, err => {
                res.writeHead(302, {
                    'Location' : `/`
                });
                res.end();
            })
        });
    } else {
        res.writeHead(404);
        res.end('not found');
    }

});
app.listen(3000);