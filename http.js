const http = require("http")


http.createServer((req,res)=>{

    req.on('data', (chunk) =>{
        console.log(JSON.parse(chunk.toString()))
        res.write('hello world')
        res.end()
    });
}).listen(8000)