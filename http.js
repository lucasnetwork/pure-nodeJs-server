const http = require("http")
const fs = require("fs")

const routes = {
    GET:{
        "/pessoas":(req,res)=>{
            if(fs.existsSync("pessoas.txt")){
                const file =fs.readFileSync("pessoas.txt")
                console.log(file)
            }
            res.writeHead(404);

            res.end("not exist file")
        }
    },
    POST:{
        "/pessoas":(req,res)=>{
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
        "/pessoas":()=>{}
    }
}

http.createServer((req,res)=>{
    const route = routes[req.method][req.url]
    if(route){
        route(req,res)
    }
}).listen(8000)