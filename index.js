const fs = require("fs");
const http = require("http");
var port = 8080
var signingBonus = 69420;
var timeBeforTokensExspire = 1 * 7 * 24 * 60 * 60 * 1000//in ms

var Users = readUserData()

function readUserData(){
    return JSON.parse(fs.readFileSync("./DataBase/Users.json","utf8"));
}

function saveUserData(data){
    fs.writeFileSync("./DataBase/Users.json",JSON.stringify(data,null,4))
}









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
                    response.write("\n<br><h1>Server Has Had an Internal Error</h1>")
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
        var path = "./clientWebsite" + request.url;
        try {
            if(path.endsWith("/")){
                path+="index.html"
            }

            if(path.endsWith(".html")){
                response.setHeader('Content-Type', 'text/html; charset=utf-8');
            }
            if(path.endsWith(".css")){
                response.setHeader('Content-Type', 'text/css; charset=utf-8');
            }
            if(path.endsWith(".js")){
                response.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            }
            if(path.endsWith(".svg")){
                response.setHeader('Content-Type', 'image/svg+xml');
            }
            if(path.endsWith(".woff2")){
                response.setHeader('Content-Type', 'font/woff2');
            }



            var file = fs.readFileSync(path,"utf8")
            response.write(file);
            response.properEnd();



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
    try {
        var package = JSON.parse(data);
    } catch (error) {
        response.write("post request was not in json format");
        throw new Error("post request was not in json format")
    }
    if(package.type == undefined){
        response.write("post request did not have a type");
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
    
    //sample:
    // {
    //     type:"create account",
    //     username:"username",
    //     password:"password"
    // }

    if(package.type == "create account"){
        if(!package.password.includes(";") && !package.username.includes(";") && package.username.length >= 3 && package.username.length <= 30 && package.password.length >= 3 && package.password.length <= 30 && Users[package.username] == undefined){
            Users[package.username] = {
                username:package.username,
                password:package.password,
                balance:signingBonus,
                tokens:[],
                transactions:[],
            }
            var newTokenPack = {
                token:package.username + ";" + generateToken(),
                expirationData:Date.now() + timeBeforTokensExspire
            }
            Users[package.username].tokens.push(newTokenPack)
            response.write(JSON.stringify({type:"token",token:newTokenPack.token,expirationData:newTokenPack.expirationData}));
            saveUserData(Users)
            response.properEnd()
        } else {
            response.write("username and or password did not pass requiremests");
            throw new Error("username and or password did not pass requiremests")
        }
    }

    //sample:
    // {
    //     type:"login",
    //     username:"John Cina",
    //     password:"BananaMan"
    // }

    if(package.type == "login"){
        if(Users[package.username] != undefined && Users[package.username].password == package.password){
            var newTokenPack = {
                token:package.username + ";" + generateToken(),
                expirationData:Date.now() + timeBeforTokensExspire
            }
            Users[package.username].tokens.push(newTokenPack)
            response.write(JSON.stringify({type:"token",token:newTokenPack.token,expirationData:newTokenPack.expirationData}));
            saveUserData(Users)
            response.properEnd()
        } else {
            response.write("account dose not exist or password is incorrect");
            throw new Error("account dose not exist or password is incorrect")
        }
    }

    if(package.type == "get account details"){
        var tokenCheckResult = getUserByToken(package.token)
        if(tokenCheckResult.status == "failed"){
            response.write(tokenCheckResult.reason);
            throw new Error(tokenCheckResult.reason)
        }
        if(tokenCheckResult.status == "succeeded"){
            var user = tokenCheckResult.user;
            response.write(JSON.stringify({type:"account details",balance:user.balance,transactions:user.transactions}));
            response.properEnd()
        } else {
            response.write("account dose not exist or password is incorrect");
            throw new Error("account dose not exist or password is incorrect")
        }
    }




    



}


function getUserByToken(token){
    var unsername = token.split(";")[0]
    if(Users[unsername] == undefined){
        return {status:"failed",reason:"invalid token"};
    }
    var tokens = Users[unsername].tokens;
    for (let i = 0; i < tokens.length; i++) {
        const tokenPack = tokens[i];
        if(tokenPack.token == token){
            if(tokenPack.expirationData <= Date.now()){
                Users[unsername].tokens.splice(i,1);
                saveUserData(Users)
                return {status:"failed",reason:"token has exspired"}
            } else {
                return {status:"succeeded",user:Users[unsername]}
            }
        }
    }
    return {status:"failed",reason:"invalid token"};
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

