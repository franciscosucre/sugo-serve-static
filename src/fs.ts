import * as fs from 'fs';

export const exists = (pathname: string) => new Promise(resolve => fs.exists(pathname, exists => resolve(exists)));

export const readFile = (pathname: string) =>
  new Promise((resolve, reject) => fs.readFile(pathname, (err: any, data: any) => (err ? reject(err) : resolve(data))));
