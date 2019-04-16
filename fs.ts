const fs = require("fs");

const exists = pathname => new Promise(resolve => fs.exists(pathname, exists => resolve(exists)));

const readFile = pathname => new Promise((resolve, reject) => fs.readFile(pathname, (err, data) => (err ? reject(err) : resolve(data))));

module.exports = {
  exists,
  readFile
};
