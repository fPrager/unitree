const http = require('http');

const url = 'http://everynoise.com/engenremap.html';

http.get(url, (res) => {
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (data) => {
        body += data;
    });
    res.on('end', () => {
        console.log(body);
    });
});
