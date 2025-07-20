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
