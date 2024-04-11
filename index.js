const fs = require("fs");
const http = require("http");
var port = 8080

function requestListener(request,response){
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', '*');

    response.write("<h1>server is on</h1>")
    response.end()
}

var server = http.createServer(requestListener)


server.listen(port);
