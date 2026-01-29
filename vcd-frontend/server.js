const express = require('express');
const { exec } = require('child_process');
const staticFiles = require('./static-files'); // uses generated map

const app = express();

// Use a prefix match instead of '*'
// This avoids path-to-regexp completely
app.use((req, res) => {
  const reqPath = req.path === '/' ? '/index.html' : req.path;
  const file = staticFiles[reqPath];

  if (file) {
    res.setHeader('Content-Type', file.contentType);
    res.send(Buffer.from(file.content, 'base64'));
  } else {
    // fallback to index.html for SPA routing
    const indexFile = staticFiles['/index.html'];
    if (indexFile) {
      res.setHeader('Content-Type', indexFile.contentType);
      res.send(Buffer.from(indexFile.content, 'base64'));
    } else {
      res.status(404).send('Not Found');
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ App running at http://localhost:${PORT}`);
  exec(`start http://localhost:${PORT}`);
});
