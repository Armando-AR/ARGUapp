import {createUser} from "./index.js";

document.getElementById("regbtn").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("REGISTRANDO USUARIO........");
    const email = document.getElementById("typeEmail").value;
    const pass = document.getElementById("typePassword").value;
    const name = document.getElementById("typeName").value;
    const username = document.getElementById("typeUsername").value;

    createUser(email, pass, name, username);
  });