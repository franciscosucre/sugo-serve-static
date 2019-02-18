import * as fs from 'fs';
import * as path from 'path';
import { FileNotFoundError } from './exceptions';
import { IGenerateStaticFileHandlerOptions } from './interfaces';

export const readFile = (filePath: string) =>
  new Promise<Buffer>((resolve, reject) => {
    fs.readFile(filePath, (error: NodeJS.ErrnoException, content: Buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(content);
      }
    });
  });

export const serveFile = async (req: any, res: any, filePath: string) => {
  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes: any = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml',
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';
  try {
    const buffer = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(buffer, 'utf-8');
  } catch (error) {
    if (error.code == 'ENOENT') {
      throw new FileNotFoundError(req.url);
    } else {
      throw error;
    }
  }
};

export const generateStaticFileHandler = (options: IGenerateStaticFileHandlerOptions) => {
  options = Object.assign({ baseUrl: '/public', basePath: './public', normalize: true }, options);
  return async (req: any, res: any) => {
    let normalizedUrl = options.normalize ? path.normalize(req.url) : req.url;
    normalizedUrl = normalizedUrl.replace(options.baseUrl, '');
    const filePath = path.resolve(options.basePath, '.' + normalizedUrl);
    return await serveFile(req, res, filePath);
  };
};

export default generateStaticFileHandler;
