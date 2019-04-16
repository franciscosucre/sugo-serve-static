import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { FileNotFoundError } from './exceptions';
import { exists, readFile } from './fs';

// maps file extention to MIME types
const mimeType: { [key: string]: string } = {
  '.css': 'text/css',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'aplication/font-sfnt',
  '.wav': 'audio/wav',
};

export interface IServeStaticOptions {
  dir: string;
  baseUrl?: string;
}

export const serveStatic = (options: IServeStaticOptions) => async (req: any, res: any, next: any) => {
  let { pathname } = url.parse(req.url);
  let sanitizedUrl: string;
  if (options.baseUrl) {
    pathname = (pathname as string).replace(options.baseUrl, '');
  }
  sanitizedUrl = path.normalize(pathname as string).replace(/^(\.\.[\/\\])+/, '');
  pathname = path.join(options.dir, sanitizedUrl);
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
    res.setHeader('content-length', data.byteLength);
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.end(`Error getting the file: ${err}.`);
  }
};

export default serveStatic;
