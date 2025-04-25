// const express = require('express');
// const path = require('path');
// const app = express();

// app.use(express.static(path.join(__dirname, 'static')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'templates', 'home.html'));
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);
// });

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

http.createServer((req, res) => {
    let filePath = './templates/home.html'; // Default file

    if (req.url !== '/' && req.url !== '/home.html') {
        filePath = '.' + req.url; // turns /static/css/home.css into ./static/css/home.css
    }

    const extname = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';

    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.html':
            contentType = 'text/html';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
        default:
            contentType = 'application/octet-stream';
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});