import * as fs from 'fs';

export const exists = (pathname: string) =>
  new Promise(resolve => fs.exists(pathname, (result: boolean) => resolve(result)));

export const readFile: (pathname: string) => Promise<Buffer> = (pathname: string) =>
  new Promise((resolve, reject) =>
    fs.readFile(pathname, (err: NodeJS.ErrnoException, data: Buffer) => err ? reject(err) : resolve(data)),
  );
