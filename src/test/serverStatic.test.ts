import Router from '@sugo/router';
import { createServer } from '@sugo/server';
import SuGoRequest from '@sugo/server/dist/Request';
import SuGoResponse from '@sugo/server/dist/Response';
import * as chai from 'chai';
import { resolve } from 'path';
import * as supertest from 'supertest';
import generateStaticFileHandler from '../serveStatic';
chai.should();

const router = new Router();
router.get(
  '/public/(.*)',
  generateStaticFileHandler({
    basePath: resolve(__dirname, './public'),
    baseUrl: '/public',
    normalize: true,
  }),
);
const server = createServer((req: SuGoRequest, res: SuGoResponse) => router.handle(req, res)).setLogger({
  debug() {
    return;
  },
  error() {
    return;
  },
  info() {
    return;
  },
  log() {
    return;
  },
  warn() {
    return;
  },
});

describe('SuGo Static FIle Hanlder', () => {
  after(() => {
    process.exit(0);
  });

  it('should serve the static file using the base path', async () => {
    const response = await supertest(server).get('/public/test.txt');
    response.status.should.be.eql(200);
    response.body.byteLength.should.be.gt(0);
  });

  it('should throw an error if the file is not found', async () => {
    const response = await supertest(server).get('/public/no-file.txt');
    response.status.should.be.eql(404);
    response.body.name.should.be.eql('FileNotFoundError');
  });
});
