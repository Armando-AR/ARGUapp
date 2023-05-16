import { onGetTask } from "./JS/index.js";

let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");

startDate.addEventListener("change", (e) => {
  let startDateVal = e.target.value;
  document.getElementById("startDateSelected").innerText = startDateVal;
});

const taskContainer = document.getElementById("list-container");


window.addEventListener("DOMContentLoaded", async () => {
  onGetTask((querySnapshot) => {
    let html = "";
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      console.log(doc.data());
      const dateFormat= task.Fecha.toDate();
    const fechaDeTarea = dateFormat.getFullYear() + "-" + (dateFormat.getMonth()+1) + "-" + dateFormat.getDate();
      html += `
            <tr>
                <th>${task.IdUsuario}</th>
                <th>${fechaDeTarea}</th>
                <th>${task.Dificultad}</th>
                <th>${task.NombreTarea}</th>
                <th>${task.Nota}</th>
            </tr>
        `;
        
    });
    
    taskContainer.innerHTML = html;
  });
});
