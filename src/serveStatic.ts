import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { FileNotFoundError } from './exceptions';
import { exists, readFile } from './fs';
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 9000;

// maps file extention to MIME types
const mimeType: any = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt',
};

const serveStatic = ({ dir = path.resolve('./'), baseUrl = '/' }) => async (req: any, res: any, next: any) => {
  const parsedUrl = url.parse(req.url);
  const sanitizedUrl = path.normalize(parsedUrl.pathname as string).replace(/^(\.\.[\/\\])+/, '');
  if (!sanitizedUrl.startsWith(baseUrl)) {
    return next ? await next() : null;
  }

  let pathname = path.join(dir, sanitizedUrl.replace(baseUrl, ''));
  if (!(await exists(pathname))) {
    throw new FileNotFoundError(`File not found. URL: ${sanitizedUrl}`);
  }
  // if is a directory, then look for index.html
  if (fs.statSync(pathname).isDirectory()) {
    pathname += '/index.html';
  }
  try {
    const data = await readFile(pathname);
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;
    // if the file is found, set Content-type and send data
    res.setHeader('Content-type', mimeType[ext] || 'text/plain');
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.end(`Error getting the file: ${err}.`);
  }
};

module.exports = serveStatic;
