const http = require("http")
const fs = require("fs")

const routes = {
    GET:{
        "pessoas":(req,res)=>{
            if(fs.existsSync("pessoas.txt")){
                const file =fs.readFileSync("pessoas.txt")
                console.log(file)
            }
            res.writeHead(404);

            res.end("not exist file")
        },
        "download":(req,res)=>{
            if(fs.existsSync("pessoas.txt")){
                res.writeHead(200, {'Content-Type': 'application/force-download','Content-disposition':'attachment; filename=pessoas.txt'});
                fs.createReadStream("pessoas.txt").pipe(res)
            }
        }
    },
    POST:{
        "pessoas":(req,res)=>{
            req.on("data",(chunk)=>{
                const json = JSON.parse(chunk.toString())
                let data = ''
                if(fs.existsSync("pessoas.txt")){
                    const file = fs.readFileSync("pessoas.txt").toString()
                    data = file + "\n" +json.name
                }
                fs.writeFileSync("pessoas.txt",data)
                res.end(`new Data:${data}`)
            })
        }
    },
    DELETE:{
        "pessoas":{
            ":id":(req,res)=>{
                if(fs.existsSync("pessoas.txt")){
                    const file = fs.readFileSync("pessoas.txt").toString()
                    let data = ''
                    file.split("\n").forEach((value,index)=>{
                        if(index !== Number(req.params.id)){
                            data += value+ "\n" 
                        }
                    })
                    fs.writeFileSync("pessoas.txt",data)
                    res.end("name deleted")
                }
            }
        }
    }
}

http.createServer((req,res)=>{
    let route = routes[req.method]
    req.url.split("/").forEach(url =>{
        if(url == ""){
            return
        }
        if(typeof route[url] === 'function'){
            route = route[url]
        }else if(route[url]){
            route = route[url]
        }else if(route[":id"]){
            route = route[":id"]
            req.params= {id:url}
        }
    })
    if(typeof route === 'function'){
        route(req,res)
    }
}).listen(8000)
