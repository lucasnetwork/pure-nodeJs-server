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
        "pessoas":{
            ":id":(req,res)=>{
                console.log(req.params)
                res.end("not exist file")

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
        "pessoas":()=>{}
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
    if(route){
        route(req,res)
    }
}).listen(8000)