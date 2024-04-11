async function sendPostDemo() {
    var url = document.getElementById("url").value;
    var inputData = document.getElementById("PostOut").value;
    var outData = document.getElementById("PostIn");
    var package = {};
    outData.value = ""
    try {
        package = JSON.parse(inputData);
    } catch (error) {
        outData.value = `Error (During Input Parsing):${error}`
        return;
    }

    outData.value = await post(url, package)

}

async function post(url, package) {
    if (typeof package == "object") {
        package = JSON.stringify(package)
    }
    return await (await fetch(url, {
        method: "POST",
        body: package,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })).text()
}

function savePostOut() {
    
    localStorage.setItem("PostOut", document.getElementById("PostOut").value);
}

function saveURL() {
    
    localStorage.setItem("url_save", document.getElementById("url").value);
}
if(localStorage.getItem("PostOut") != undefined){
    document.getElementById("PostOut").value = localStorage.getItem("PostOut");

}
if(localStorage.getItem("url_save") != undefined){

    document.getElementById("url").value = localStorage.getItem("url_save")
}