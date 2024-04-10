function sendPostDemo(){
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

    
    outData.value = post(url,package)
    //TODO:
    //by pass cors
}

function post(url,package){
    if (typeof package == "object"){
        package = JSON.stringify(package)
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 201) {
        return JSON.parse(xhr.responseText)
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
    return xhr.send(package);
}