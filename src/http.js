const http = require("http");
const fs = require("fs");
const path = require("path");
const Route = require("./route")
const route = new Route()


const pathFile = path.resolve(__dirname,'..','pessoas.txt')
const pathIndexFileHtml = path.resolve(__dirname,"static","pages","index.html")
const pathErrorFileHtml = path.resolve(__dirname,"static","pages","error.html")

route.get("pessoas", (req, res) => {
  if (fs.existsSync(pathFile)) {
    fs.createReadStream(pathFile).pipe(res)
    return
  }
  res.writeHead(404);
  res.end("not exist file");
})
route.get("api/download/",(req, res) => {
  if (fs.existsSync(pathFile)) {
    res.writeHead(200, {
      "Content-Type": "application/force-download",
      "Content-disposition": "attachment; filename=pessoas.txt",
    });
    fs.createReadStream(pathFile).pipe(res);
  }
})

route.get("/",(req, res) => {
  res.writeHead(200, { "Content-Type": "text/HTML" });
  fs.createReadStream(pathIndexFileHtml).pipe(res);
})

route.post("pessoas",(req, res) => {
  req.on("data", (chunk) => {
    const json = JSON.parse(chunk.toString());
    let data = "";
    if (fs.existsSync(pathFile)) {
      const file = fs.readFileSync(pathFile).toString();
      data = file + "\n" + json.name;
    }
    fs.writeFileSync(pathFile, data);
    res.end(`new Data:${data}`);
  })})

route.delete("pessoas/:id",(req, res) => {
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
})

console.log(route.route)

http
  .createServer((req, res) => {
    let routes = route.route[req.method];
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
