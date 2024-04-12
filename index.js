const fs = require("fs");
const http = require("http");
var port = 8080

function requestListener(request,response){

    response.hasEnded = false;
    response.properEnd = (...args) => {
        if(response.hasEnded == false){
            response.end(...args);
            response.hasEnded = true;
        }
    }





    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    response.setHeader('Access-Control-Allow-Headers', '*');

    console.log(request)

    if(request.method == "OPTIONS"){
        console.log("Preflight Options Http Request")
        response.properEnd()
        return
    } else if (request.method == "POST"){
        console.log("Post Request")
        console.log(request.url)
        console.log(request.method)
        if(request.url.startsWith("/api")){
            //Get POST Data

            let body = "";
            let ReciveData = (chunk) =>{
                body += chunk.toString();
            }
            request.on("data", ReciveData);

            let EndDataReviving = () =>{
                try {
                    handleApiCall(body,response)
                } catch (error){
                    console.error(error)
                    response.write("<h1>Server Has Had an Internal Error</h1>")
                    response.properEnd();

                }
                if(response.hasEnded){
                    return
                }
                
            }
            request.on("end", EndDataReviving);



        } else {
            response.write("<h1>invalid Post Request: Please Forward Any Post Request To /api")
            response.properEnd()
            return
        }
        //add later
    } else if(request.method == "GET"){
        //add later
    } else {
        response.write("<h1>fall back code</h1>")
        response.properEnd()
    }










}

var server = http.createServer(requestListener)


server.listen(port);


function handleApiCall(data,response){
    try {
        var package = JSON.parse(data);
    } catch (error) {
        response.write("post request was not in json format");
        response.properEnd();
        throw new Error("post request was not in json format")
    }
    if(package.type == undefined){
        response.write("post request did not have a type");
        response.properEnd();
        throw new Error("post request did not have a type")
    }

    if(package.type == "test pack"){
        response.write(JSON.stringify({
            type:"test pack",
            time:Date.now(),
            randomInt:Math.random() * (package.max + 1 - package.min) + package.min
        }));
        response.properEnd()
        return;
    }


    



}


