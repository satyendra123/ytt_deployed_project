const express = require('express');
const { exec } = require('child_process');
const path = require('path');

// ✅ Preload files from embedded build folder
const readFilesRecursively = require('./loadStaticFiles');
const staticFiles = readFilesRecursively(path.join(__dirname, 'build'));

const app = express();

app.get('*', (req, res) => {
  const reqPath = req.path === '/' ? '/index.html' : req.path;
  const file = staticFiles[reqPath];

  if (file) {
    res.setHeader('Content-Type', file.contentType);
    res.send(file.content);
  } else {
    res.status(404).send('Not Found');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ App running at http://localhost:${PORT}`);
  exec(`start http://localhost:${PORT}`);
});
