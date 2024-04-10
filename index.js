const fs = require("fs");
const http = require("http");
var port = 8080

function requestListener(request,response){
    response.end("<h1>server is on</h1>")
}

var server = http.createServer(requestListener)


server.listen(port);
