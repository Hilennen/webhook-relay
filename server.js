const http = require('http');
const SECRET = process.env.SECRET || 'changeme';
let signalPending = false;

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  
  if (url.searchParams.get('token') !== SECRET) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }

  if (req.method === 'POST' && url.pathname === '/signal') {
    signalPending = true;
    res.end('ok');
  } else if (req.method === 'GET' && url.pathname === '/poll') {
    res.end(signalPending ? 'yes' : 'no');
    signalPending = false;
  }
}).listen(process.env.PORT || 8080);