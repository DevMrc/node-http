const http = require('http');
const { URL } = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  
  const baseURL = 'http://' + req.headers.host + '/';
  const parsedURL = new URL(req.url, baseURL);

  const params = Object.fromEntries(parsedURL.searchParams);

  const queryObj = {
    name: 'Marco',
    age: 24,
    interest: ['football', 'programming']
  };

  const queryStr = querystring.stringify(queryObj);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    path: parsedURL.pathname,
    params,
    exampleQueryString: queryStr
  }, null, 2))
});

server.listen(3000);
