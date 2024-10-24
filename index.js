const http = require('http');
const server = http.createServer((req,res)=>{
    res.end('HelloWorld');
})

const port = 3000;
server.listen (port,()=>{
    console.log('Server listen to' + port);
})