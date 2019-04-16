import Router from '@sugo/router';
import { createServer } from '@sugo/server';
import SuGoRequest from '@sugo/server/dist/Request';
import SuGoResponse from '@sugo/server/dist/Response';
import * as chai from 'chai';
import { resolve } from 'path';
import * as supertest from 'supertest';
import { serveStatic } from '../serveStatic';
chai.should();

describe('SuGo Static FIle Hanlder', () => {
  after(() => {
    process.exit(0);
  });

  it('should serve the static file at base route if used as a server middleware', async () => {
    const server = createServer((req: SuGoRequest, res: SuGoResponse) => null).useMiddleware(
      serveStatic({
        dir: resolve(__dirname, './public'),
      }),
    );
    const response = await supertest(server).get('/hello.html');
    response.status.should.be.eql(200);
    response.text.should.be.eql('<p>Hello</p>\n');
  });

  it('should serve the static file with the given route if used as a route middleware', async () => {
    const router = new Router();
    router.get(
      '/public/(.*)',
      serveStatic({
        baseUrl: '/public',
        dir: resolve(__dirname, './public'),
      }),
    );
    const server = createServer((req: SuGoRequest, res: SuGoResponse) => router.handle(req, res));
    const response = await supertest(server).get('/public/hello.html');
    response.status.should.be.eql(200);
    response.text.should.be.eql('<p>Hello</p>\n');
  });

  it('should serve a index.html if given a directory', async () => {
    const server = createServer((req: SuGoRequest, res: SuGoResponse) => null).useMiddleware(
      serveStatic({
        dir: resolve(__dirname, './public'),
      }),
    );
    const response = await supertest(server).get('/');
    response.status.should.be.eql(200);
    response.text.should.be.eql('<p>Index</p>\n');
  });

  it('should throw an error if the file is not found', async () => {
    const server = createServer((req: SuGoRequest, res: SuGoResponse) => null).useMiddleware(
      serveStatic({
        dir: resolve(__dirname, './public'),
      }),
    );
    const response = await supertest(server).get('/no-file.txt');
    response.status.should.be.eql(404);
    response.body.name.should.be.eql('FileNotFoundError');
  });
});
