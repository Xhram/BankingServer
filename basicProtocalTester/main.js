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




}

function post()