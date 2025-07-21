const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

function readFilesRecursively(dir, base = '') {
  let files = {};
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(base, item).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = { ...files, ...readFilesRecursively(fullPath, relativePath) };
    } else {
      files[`/${relativePath}`] = {
        content: fs.readFileSync(fullPath),
        contentType: mime.lookup(item) || 'application/octet-stream',
      };
    }
  });

  return files;
}

module.exports = readFilesRecursively;
