import {login} from "./index.js";

document.getElementById("loginbtn").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("ACCEDIENDO AL USUARIO REGISTRADO...");
    const email = document.getElementById("typeEmailX").value;
    const password = document.getElementById("typePasswordX").value;
    login(email, password);
  });