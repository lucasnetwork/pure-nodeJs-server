const http = require("http");
const fs = require("fs");
const path = require("path");
const route = require("./routes/index")

const pathErrorFileHtml = path.resolve(__dirname,"static","pages","error.html")


http
  .createServer((req, res) => {
    let routes = route[req.method];
    req.url.split("/").forEach((url, index) => {
      if (url == "" && index + 1 == req.url.length && routes.index) {
        routes = routes.index;
      }
      if (url == "") {
        return;
      }
      if (typeof routes[url] === "function") {
        routes = routes[url];
      } else if (routes[url]) {
        routes = routes[url];
      } else if (routes[":id"]) {
        routes = routes[":id"];
        req.params = { id: url };
      }
    });
    if (typeof routes === "function") {
      routes(req, res);
    } else {
      res.writeHead(200, { "Content-Type": "text/HTML" });
      fs.createReadStream(pathErrorFileHtml).pipe(res);
    }
  })
  .listen(8000);
