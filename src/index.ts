const serveStatic = require('./serveStatic');
const path = require('path');

const { createServer } = require('@sugo/server');

const server = createServer((req, res) => console.log(req.url))
  .useMiddleware(serveStatic({ dir: path.resolve('./dashboard'), baseUrl: '/dashboard' }))
  .listen(5000);
