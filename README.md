# **@sugo/serve-static**

Handler for serving static files. Router agnostic. Recommended use with [@sugo/router](https://www.npmjs.com/package/@sugo/router)

# **generateStaticFileHandler**

Returns a route handler that reads and sends files.

## **Options**

- **@param {\string} basePath:** The directory in which the files are stored
- **@param {\string} baseUrl:** The base url on the request to indicate that a static file is requested. If baseUrl is /base and the request url is /base/bar/foo.txt, then the file to be search will correspond to the path /bar/foo.txt.
- **@param {\boolean} normalize:** Indicates if the given path should be normalized. Uses [NodeJS normalize method](https://nodejs.org/docs/latest-v10.x/api/path.html#path_path_normalize_path). Defaults to true.

## **Requirements**

node version >= 9.11.2

## **How to install**

```shell
npm install --save @sugo/serve-static
```

## **Example**

```typescript
import Router from '@sugo/router';
import { resolve } from 'path';
import generateStaticFileHandler from '../serveStatic';
chai.should();

const router = new Router();
router.get(
  '/public/(.*)',
  generateStaticFileHandler({
    baseUrl: '/public',
    basePath: resolve(__dirname, './public'),
    normalize: true,
  }),
);
```
