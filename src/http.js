const http = require("http");
const fs = require("fs");
const path = require("path");

const pathFile = path.resolve(__dirname,'..','pessoas.txt')
const pathIndexFileHtml = path.resolve(__dirname,"static","pages","index.html")
const pathErrorFileHtml = path.resolve(__dirname,"static","pages","error.html")
const routes = {
  GET: {
    api: {
      pessoas: (req, res) => {
        if (fs.existsSync(pathFile)) {
          const file = fs.readFileSync(pathFile);
        }
        res.writeHead(404);

        res.end("not exist file");
      },
      download: (req, res) => {
        if (fs.existsSync(pathFile)) {
          res.writeHead(200, {
            "Content-Type": "application/force-download",
            "Content-disposition": "attachment; filename=pessoas.txt",
          });
          fs.createReadStream(pathFile).pipe(res);
        }
      },
    },
    index: (req, res) => {
      res.writeHead(200, { "Content-Type": "text/HTML" });
      fs.createReadStream(pathIndexFileHtml).pipe(res);
    },
  },
  POST: {
    pessoas: (req, res) => {
      req.on("data", (chunk) => {
        const json = JSON.parse(chunk.toString());
        let data = "";
        if (fs.existsSync(pathFile)) {
          const file = fs.readFileSync(pathFile).toString();
          data = file + "\n" + json.name;
        }
        fs.writeFileSync(pathFile, data);
        res.end(`new Data:${data}`);
      });
    },
  },
  DELETE: {
    pessoas: {
      ":id": (req, res) => {
        if (fs.existsSync(pathFile)) {
          const file = fs.readFileSync(pathFile).toString();
          let data = "";
          file.split("\n").forEach((value, index) => {
            if (index !== Number(req.params.id)) {
              data += value + "\n";
            }
          });
          fs.writeFileSync(pathFile, data);
          res.end("name deleted");
        }
      },
    },
  },
};

http
  .createServer((req, res) => {
    let route = routes[req.method];
    req.url.split("/").forEach((url, index) => {
      if (url == "" && index + 1 == req.url.length && route.index) {
        route = route.index;
      }
      if (url == "") {
        return;
      }
      if (typeof route[url] === "function") {
        route = route[url];
      } else if (route[url]) {
        route = route[url];
      } else if (route[":id"]) {
        route = route[":id"];
        req.params = { id: url };
      }
    });
    if (typeof route === "function") {
      route(req, res);
    } else {
      res.writeHead(200, { "Content-Type": "text/HTML" });
      fs.createReadStream(pathErrorFileHtml).pipe(res);
    }
  })
  .listen(8000);
