# ytt_deployed_project
run_server.py code - 
import logging
import traceback
from waitress import serve
from anpr_backened.wsgi import application

logging.basicConfig(filename="server.log",filemode="w",level=logging.DEBUG,format="%(asctime)s [%(levelname)s] %(message)s")

print("🔧 Starting Waitress server on http://0.0.0.0:8000")
logging.info("Starting Waitress server...")

try:
    serve(application, host='0.0.0.0', port=8000)
except Exception as e:
    logging.error(" Exception occurred while running server:")
    logging.error(traceback.format_exc())
    print(" Server crashed! Check server.log")

2) then run ths code to make the exe

python "C:\Users\Satyendra Singh\AppData\Roaming\Python\Python39\Scripts\pyinstaller.exe" --onefile --noconsole --hidden-import=authentication --hidden-import=authentication.apps --hidden-import=authentication.urls --hidden-import=accounts --hidden-import=accounts.apps --hidden-import=accounts.urls --hidden-import=controller --hidden-import=controller.apps --hidden-import=controller.urls --hidden-import=dashboard --hidden-import=dashboard.apps --hidden-import=dashboard.urls --hidden-import=dj_rest_auth --hidden-import=dj_rest_auth.registration --hidden-import=allauth --hidden-import=allauth.account --hidden-import=allauth.socialaccount --hidden-import=rest_framework run_server.py

b) frontend exe - frontend code making the exe without using the build dependency
1) npm install express mime-types
2) npm install pkg
3) npm install serve-handler

4)  make a file loadStaticFiles.js code when it is made by the create-react-app
a) loadStaticFiles.js
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

b) server.js
const express = require('express');
const { exec } = require('child_process');
const path = require('path');

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
  console.log(`App running at http://localhost:${PORT}`);
  exec(`start http://localhost:${PORT}`);
});

5) npm run build. so if build folder is created then in the server.js we need to write __dirname, "build". and if dist folder is created then __dirname, "dist" is made

6) add this line in the package.json file. below the name and the error
 "bin": "server.js",
  "pkg": {
    "assets": [
      "build/**/*"
   ]
  },
  
7)pkg . --targets node18-win-x64 --output yttfrontend.exe

second-way

1) // loadStaticFiles.js
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

2) server.js
const express = require('express');
const { exec } = require('child_process');
const staticFiles = require('./static-files'); // uses generated map

const app = express();

app.get('*', (req, res) => {
  const reqPath = req.path === '/' ? '/index.html' : req.path;
  const file = staticFiles[reqPath];

  if (file) {
    // Serve actual static file
    res.setHeader('Content-Type', file.contentType);
    res.send(Buffer.from(file.content, 'base64'));
  } else {
    // Fallback to index.html for client-side routes like /dashboard, /boom, etc.
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

3) npm run build
4) node loadStaticFiles.js
5) pkg . --targets node18-win-x64 --output yttfrontend.exe

