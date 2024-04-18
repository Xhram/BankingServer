function createAccount() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if(!username || !password) return formError({type:"no input"});
  fetch("../api/createAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "create account",
      username: username,
      password: password,
    }),
  })
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    if(response?.type === "token" && response?.token) {
      writeTokenToLocal(response.token);
      redirect("../account/index.html");
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

function formError(error) {
  switch(error.type) {
    case "no input":
      const username = document.getElementById("username");
      if(!username.value) {
        const usernameCover = document.getElementById("usernameCover");
        usernameCover.style.border = "1px solid var(--denied)";
        username.placeholder = "Create Username";
        username.onkeydown = () => {usernameCover.style.border = "none";username.placeholder = "";}
      }
      if(!password.value) {
        const password = document.getElementById("password");
        const passwordCover = document.getElementById("passwordCover");
        passwordCover.style.border = "1px solid var(--denied)";
        password.placeholder = "Create Password";
        password.onkeydown = () => {passwordCover.style.border = "none";password.placeholder = "";}
      }
      break;
  }
}