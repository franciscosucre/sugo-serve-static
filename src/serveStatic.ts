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
  notFoundRedirectPath?: string;
}

const sanitizePath = (rawPath: string, dir: string, baseUrl?: string) => {
  let { pathname } = url.parse(rawPath);
  let sanitizedPath: string;
  if (baseUrl) {
    pathname = (pathname as string).replace(baseUrl, '');
  }
  sanitizedPath = path.normalize(pathname as string).replace(/^(\.\.[\/\\])+/, '');
  if (path.isAbsolute(dir)) {
    sanitizedPath = path.join(dir, sanitizedPath);
  } else {
    sanitizedPath = path.join(process.cwd(), dir, sanitizedPath);
  }
  return sanitizedPath;
};

const getFile = async (rawPath: string, options: IServeStaticOptions): Promise<{ data: Buffer; ext: string }> => {
  let pathname = sanitizePath(rawPath, options.dir, options.baseUrl);
  const pathExists = await exists(pathname);
  if (!pathExists && !options.notFoundRedirectPath) {
    throw new FileNotFoundError(`File not found. URL: ${pathname}`);
  } else if (!pathExists && options.notFoundRedirectPath) {
    return getFile(options.notFoundRedirectPath, {
      baseUrl: options.baseUrl,
      dir: options.dir,
    });
  }
  if (fs.statSync(pathname).isDirectory()) {
    pathname = path.join(pathname, 'index.html');
  }
  const data = await readFile(pathname);
  const ext = path.parse(pathname).ext;
  return { data, ext };
};

export const serveStatic = (options: IServeStaticOptions) => async (req: any, res: any, next?: any) => {
  const { data, ext } = await getFile(url.parse(req.url).pathname as string, options);
  res.setHeader('Content-type', mimeType[ext] || 'text/plain');
  res.setHeader('content-length', data.byteLength);
  res.end(data);
};

export default serveStatic;
