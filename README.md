# **@sugo/serve-static**

Handler for serving static files. Router agnostic. Recommended use with [@sugo/router](https://www.npmjs.com/package/@sugo/router)

# **serveStatic**

Returns a middleware that reads and sends files.

## **Options**

- **@param {\string} dir:** The directory in which the files are stored.
- **@param {\string} baseUrl:** The base url on the request to indicate that a static file is requested. If baseUrl is /base and the request url is /base/bar/foo.txt, then the file to be search will correspond to the path /bar/foo.txt.
- **@param {\string} notFoundRedirectPath:** The filepath to be served if the requested file was not found. Can be used to render a 404 page. If not set, then it will throw an error when the file is not found. It this path is not found, it will also throw an error.

## **Requirements**

node version >= 8.12.0

## **How to install**

```shell
npm install --save @sugo/serve-static
```

## **Requesting a directory**

If the user request a directory instead of a file, the middleware will search for a index.html in that directory.

## **Example - Server**

```typescript
import { createServer } from '@sugo/server';
import Router from '@sugo/router';
import { resolve } from 'path';
import serveStatic from '@sugo/serve-static';

const server = createServer((req: SuGoRequest, res: SuGoResponse) => router.handle(req, res)).useMiddleware(
  serveStatic({
    dir: resolve(__dirname, './public'),
  }),
);
```

## **Example - With routes**

```typescript
import { createServer } from '@sugo/server';
import Router from '@sugo/router';
import { resolve } from 'path';
import serveStatic from '@sugo/serve-static';

const router = new Router();
router.get(
  '/public/(.*)',
  serveStatic({
    baseUrl: '/public',
    dir: resolve(__dirname, './public'),
    notFoundRedirectPath: '404.html',
  }),
);
const server = createServer((req: SuGoRequest, res: SuGoResponse) => router.handle(req, res));
```

## **Example - NodeHttp**

```typescript
import * as http from 'http';
import serveStatic from '@sugo/serve-static';

const middleware = serveStatic({
  dir: resolve(__dirname, './public'),
});
const server = http.createServer((req, res) => middleware(req, res));
```

## **Example - Hosting a Single Page Application (ReactJS, Angular, VueJS) **

```typescript
import { createServer } from '@sugo/server';
import Router from '@sugo/router';
import { resolve } from 'path';
import serveStatic from '@sugo/serve-static';

const router = new Router();
router.get(
  '/webapp/(.*)',
  serveStatic({
    baseUrl: '/webapp',
    dir: resolve(__dirname, './webapp'),
    notFoundRedirectPath: 'index.html',
  }),
);
const server = createServer((req: SuGoRequest, res: SuGoResponse) => router.handle(req, res));
```
