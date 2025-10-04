const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if(err){
            res.statusCode = 404;
            res.end('File not found');
            return;
        }

        fs.stat(filePath, (err, stats) => {
            res.statusCode = 500,
            res.end('Internal Server Error');
            return;
        });

        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Type', 'application/octet-stream');

        const readStream = fs.createReadStream(filePath);

        stream.on('error', (err) => {
            console.log('error reading file', err);

            if(!res.headersSent){
                res.statusCode = 500;
                res.end('error reading file');
            }
        });

        stream.pipe(res);
    })
})

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`File server running at http://localhost:${PORT}/`);
});