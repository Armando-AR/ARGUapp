import { logout, getCurrentUserData } from "./index.js"

getCurrentUserData();

document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Saliendo de la sesion");
    logout();
  });