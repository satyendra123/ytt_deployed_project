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
        content: fs.readFileSync(fullPath).toString('base64'),
        contentType: mime.lookup(item) || 'application/octet-stream',
      };
    }
  });

  return files;
}

// Generate the output JS file with embedded static content
const staticFiles = readFilesRecursively(path.join(__dirname, 'build'));
fs.writeFileSync(
  path.join(__dirname, 'static-files.js'),
  'module.exports = ' + JSON.stringify(staticFiles, null, 2)
);

console.log('✅ static-files.js generated successfully.');