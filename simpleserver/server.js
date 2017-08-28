const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const myTypes = {
    html: 'text/html',
    jpeg: 'image/jpeg',
    png: 'image/png',
    js: 'image/javascript',
    css: 'image/css',
};

http.createServer((req, res) => {
    let uri = url.parse(req.url).pathname;
    let fileName = path.join(process.cwd(), unescape(uri));
    console.log(`Loading ${uri}`);
    let stats;

    try {
        stats = fs.lstatSync(fileName);

    } catch (e) {
        res.writeHead(404, {
            'Content-type': 'text/plain'
        });
        res.write('404 Not Found\n');
        res.end();
        return;
    }

    if (stats.isFile()) {
        let mineType = myTypes[path.extname(fileName).split("").reverse()[0]];
        res.writeHead(200, {
            'Content-type': mineType
        });

        let fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);

    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {
            'Content-type': 'text\plain'
        });
        res.write('500 Internal Error\n');
        res.end();
    }
}).listen(1337);