const Route = require("../route");
const path = require("path");
const fs = require("fs");

const route = new Route();
const pathFile = path.resolve(__dirname, "..", "..", "pessoas.txt");
const pathIndexFileHtml = path.resolve(
  __dirname,
  "..",
  "static",
  "pages",
  "index.html"
);

route.get("pessoas", (req, res) => {
  if (fs.existsSync(pathFile)) {
    const file = fs.readFileSync(pathFile).toString().split("\n");
    let html = "<ul>";
    file.forEach((pessoa) => {
      html += "<li>" + pessoa + "</li>";
    });
    html += "</ul>";
    res.writeHead(200, {
      "content-Type": "text/HTML",
    });
    res.write(html);

    res.end();
    return;
  }
  res.writeHead(404);
  res.end("not exist file");
});
route.get("api/download/", (req, res) => {
  if (fs.existsSync(pathFile)) {
    res.writeHead(200, {
      "Content-Type": "application/force-download",
      "Content-disposition": "attachment; filename=pessoas.txt",
    });
    fs.createReadStream(pathFile).pipe(res);
  }
});

route.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/HTML" });
  fs.createReadStream(pathIndexFileHtml).pipe(res);
});

route.post("pessoas", (req, res) => {
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
});

route.delete("pessoas/:id", (req, res) => {
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
});

route.get("static/css/:id",(req,res)=>{
  const pathCss = path.resolve(__dirname,'..','static','css',req.params.id)
  if(fs.existsSync(pathCss)){
    fs.createReadStream(pathCss).pipe(res)
  }else{
    res.writeHead(404)
    res.end("Css not exist")
  }
})


module.exports = route.route;
