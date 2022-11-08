const http = require("http")

const routes = {
    GET:{
        "/pessoas":(req,res)=>{
            res.write("hello world")
            res.end()
        }
    },
    POST:{
        "/pessoas":()=>{}
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