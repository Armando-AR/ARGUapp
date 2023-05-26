import { createTask } from "./index.js";


document.getElementById("addTask").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Registrando tarea");

    const nombre = document.getElementById("NomTarea").value;
    const dif = document.getElementById("difTarea").value;
    const iniFecha = document.getElementById("startDate").valueAsDate;
    const finFecha = document.getElementById("endDate").valueAsDate;
    const nota = document.getElementById("notasTarea").value;

    createTask(nombre,dif,iniFecha,finFecha,nota);
  });