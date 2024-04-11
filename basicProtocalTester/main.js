async function sendPostDemo(){
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

    outData.value = await post(url,package)
    //TODO:
    //by pass cors
}

async function post(url,package){
    if (typeof package == "object"){
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