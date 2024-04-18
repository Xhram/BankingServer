const fs = require("fs");
const http = require("http");
var port = 8080
var signingBonus = 10000;


function readUserData(){
    return JSON.parse(fs.readFileSync("./DataBase/Users.json","utf8"));
}

function saveUserData(data){
    fs.writeFileSync("./DataBase/Users.json",JSON.stringify(data,null,4))
}



function addCorsHeaders(response){
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
}





function requestListener(request,response){

    response.hasEnded = false;
    response.properEnd = (...args) => {
        if(response.hasEnded == false){
            response.end(...args);
            response.hasEnded = true;
        }
    }

    addCorsHeaders(response)







    if(request.method == "OPTIONS"){
        response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
        response.properEnd()
        return
    } else if (request.method == "POST"){





    } else if(request.method == "GET"){
        response.write("<h1>Hello World</h1>")
        var path = "./clientWebsite" + request.url;
        try {


        } catch (error) {
            response.write("<h1>File Most Likly Dose not Exsit</h1>")
            response.write("\n<br><h1>Server Has Had an Internal Error</h1>")
            response.properEnd();
        }

    } else {
        response.write("<h1>fall back code</h1>")
        response.properEnd()
    }










}

var server = http.createServer(requestListener)


server.listen(port);


function handleApiCall(data,response){
    var package = JSON.parse(data);



}

function getContentTypeByPath(path){
    if(path.endsWith(".html")){
        return 'text/html; charset=utf-8'
    }
    if(path.endsWith(".css")){
        return 'text/css; charset=utf-8'
    }
    if(path.endsWith(".js")){
        return 'application/javascript; charset=utf-8'
    }
    if(path.endsWith(".svg")){
        return 'image/svg+xml'
    }
    if(path.endsWith(".woff2")){
        return 'font/woff2'
    }
    if(path.endsWith(".png")){
        return 'image/png'
    }
}


function getUserByToken(token){

}




function generateToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }

