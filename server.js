const http = require('http');
const SECRET = process.env.SECRET || 'Ilovementoolowk';
let queue = [];

http.createServer((req, res) => {
  const { searchParams, pathname } = new URL(req.url, 'http://localhost');

  if (searchParams.get('token') !== SECRET) {
    res.writeHead(403).end('forbidden');
    return;
  }

  if (req.method === 'POST' && pathname === '/signal') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const value = parseInt(body);
      if (!isNaN(value)) queue.push(value);
      res.end('ok');
    });
  } else if (req.method === 'GET' && pathname === '/poll') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(queue));
    queue = [];
  } else {
    res.writeHead(404).end();
  }

}).listen(process.env.PORT || 8080);