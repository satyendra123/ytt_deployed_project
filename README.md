# ytt_deployed_project
run_server.py code - 
import logging
import traceback
from waitress import serve
from anpr_backened.wsgi import application

logging.basicConfig(filename="server.log",filemode="w",level=logging.DEBUG,format="%(asctime)s [%(levelname)s] %(message)s")

print("🔧 Starting Waitress server on http://0.0.0.0:5000")
logging.info("Starting Waitress server...")

try:
    serve(application, host='0.0.0.0', port=5000)
except Exception as e:
    logging.error(" Exception occurred while running server:")
    logging.error(traceback.format_exc())
    print(" Server crashed! Check server.log")

2) then run ths code to make the exe

python "C:\Users\Satyendra Singh\AppData\Roaming\Python\Python39\Scripts\pyinstaller.exe" --onefile --noconsole --hidden-import=authentication --hidden-import=authentication.apps --hidden-import=authentication.urls --hidden-import=accounts --hidden-import=accounts.apps --hidden-import=accounts.urls --hidden-import=controller --hidden-import=controller.apps --hidden-import=controller.urls --hidden-import=dashboard --hidden-import=dashboard.apps --hidden-import=dashboard.urls --hidden-import=dj_rest_auth --hidden-import=dj_rest_auth.registration --hidden-import=allauth --hidden-import=allauth.account --hidden-import=allauth.socialaccount --hidden-import=rest_framework run_server.py

b) frontend exe - frontend code making the exe without using the build dependency

1) npm install pkg
2) npm install server-handle

3)  make a file server.js code when it is made by the create-react-app
server.js

const path = require("path");
const fs = require("fs");
const http = require("http");
const { exec } = require("child_process");

// Serve files from 'build' folder
const baseDir = path.join(process.pkg ? path.dirname(process.execPath) : __dirname, "build");

function getContentType(filePath) {
  const ext = path.extname(filePath);
  if (ext === ".js") return "application/javascript";
  if (ext === ".css") return "text/css";
  if (ext === ".html") return "text/html";
  if (ext === ".json") return "application/json";
  if (ext === ".ico") return "image/x-icon";
  if (ext === ".png") return "image/png";
  return "text/plain";
}

const server = http.createServer((req, res) => {
  const reqPath = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(baseDir, reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for SPA
      fs.readFile(path.join(baseDir, "index.html"), (err, fallback) => {
        if (err) {
          res.writeHead(404);
          res.end("404 Not Found");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(fallback);
        }
      });
    } else {
      res.writeHead(200, { "Content-Type": getContentType(filePath) });
      res.end(data);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  exec("start http://localhost:3000");
});

4) npm run build. so if build folder is created then in the server.js we need to write __dirname, "build". and if dist folder is created then __dirname, "dist" is made

5) add this line in the package.json file. below the name and the error
"main": "server.js",
  "pkg": {
  "assets": [
    "build/**/*"
  ]
  },
  
6) pkg server.js --targets node18-win-x64 --output yttfrontend.exe

