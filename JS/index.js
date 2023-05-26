import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-CX3BqfUTJmxB3Q6OclzmQiuY3TfjPOM",
  authDomain: "arguapp-cecb6.firebaseapp.com",
  projectId: "arguapp-cecb6",
  storageBucket: "arguapp-cecb6.appspot.com",
  messagingSenderId: "1097790679239",
  appId: "1:1097790679239:web:2ab54ce5a7cfa6aff036e2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Obtener la autenticacion de usuario
const auth = getAuth(app);

// Referencia a la base de datos
const db = getFirestore(app);

//Obtener la tabla de usuarios
const collectionUsers = collection(db, "users");

const collectionTask = collection(db, "tareas");

export const onGetTask = (callback) =>
  onSnapshot(collection(db, "tareas"), callback);

export const deleteTask = (id) => deleteDoc(doc(db, "tareas", id));

//Funcion para iniciar sesion, con correo y contraseña
export const login = (email, password) => {
  //Validar tanto como correo como contraseña
  if (validate_email(email) == false || validate_password(password) == false) {
    alert("Email o Contraseña incorrectos");
    return false;
  }
  //Iniciar sesion con los datos ya validados de email y contraseña
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert("Bienvenido");
      window.location.pathname = "./inicio.html";
      // ...
    })
    .catch((error) => {
      alert("Usuario no valido");
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

//Funcion para crear usuario
export const createUser = (email, password, name, username) => {
  //Validar todos los datos que se estan ingresando
  if (validate_email(email) == false || validate_password(password) == false) {
    alert("Email o Contraseña incorrectos");
    return false;
  } else if (validate_field(name) == false) {
    alert("Nombre no valido");
    return;
  } else if (validate_field(username) == false) {
    alert("Nombre de usuario no valido");
    return;
  }

  //Se crea un usuario con el email y la contraseña ingresados
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const IdUser = user.uid;

      //Aqui se asigna el ID del usuario registrado con el correo (Porque se crea un id unico con el registro)
      //Tambien se asignan los datos de nombre y usuario con relacion a la tabla de users
      setDoc(doc(collectionUsers), {
        IdUsuario: IdUser,
        Nombre: name,
        Usuario: username,
      })
        .then(() => {
          alert("Se ha registrado usuario");
          window.location.pathname = "./inicio.html";
        })
        .catch((error) => {
          console.error("Error al ingresar los datos del usuario:", error);
          alert("Error al ingresar los datos del usuario");
        });
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};

//Funcion para ver el usuario actual de la sesion
export const getCurrentUserData = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Obtener el id del usuario actual
      const IdUsuario = user.uid;
      console.log(IdUsuario);
      //Query para seleccionar los datos del Usuario actual
      const querySelection = query(
        collectionUsers,
        where("IdUsuario", "==", IdUsuario)
      );
      // Obtener datos de usuario con respecto al id de la sesion actual
      onSnapshot(querySelection, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //Asignacion de los datos del documento a la variable data
          var data = doc.data();
          //Se obtiene en los datos que se encuentran en data
          console.log(data.Nombre);
          console.log(data.Usuario);
        });
      });

      // ...
    } else {
      // User is signed out
      // ...
    }
  });
};

export const createTask = (nombre, dif, time1, time2, notas) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Obtener el id del usuario actual
      const IdUser = user.uid;
      console.log(IdUser);

      setDoc(doc(collectionTask), {
        IdUsuario: IdUser,
        NombreTarea: nombre,
        Dificultad: dif,
        inicioFecha: time1,
        finFecha: time2,
        Nota: notas,
        Estado: 1,
      })
        .then(() => {
          console.log("Se ha registrado la tarea");
        })
        .catch((error) => {
          console.error("Error al ingresar los datos de la tarea:", error);
        });

      // ...
    } else {
      // User is signed out
      // ...
    }
  });
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.pathname = "./index.html";
    })
    .catch((error) => {
      // An error happened.
    });
};

export const currentUserTask = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Obtener el id del usuario actual
      const IdUsuario = user.uid;
      console.log(IdUsuario);
      //Se ob
      //Query para seleccionar los datos del Usuario actual
      const querySelection = query(
        collectionTask,
        where("IdUsuario", "==", IdUsuario)
      );

      const taskContainer = document.getElementById("list-container");
      //const taskdone = document.getElementById("list-containerDone");
      // Obtener datos de usuario con respecto al id de la sesion actual
      getDocs(querySelection).then((querySnapshot) => {
        let html1 = "";
        querySnapshot.forEach((doc) => {
          const task = doc.data();
          const inifecha = task.inicioFecha.toDate();
          const fecha1 =
            "" +
            inifecha.getDate() +
            "/" +
            inifecha.getMonth() +
            "/" +
            inifecha.getFullYear();
          const finfecha = task.finFecha.toDate();
          const fecha2 =
            "" +
            finfecha.getDate() +
            "/" +
            finfecha.getMonth() +
            "/" +
            finfecha.getFullYear();

          console.log(task.Estado);

          html1 += `
            <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${task.NombreTarea}</h5>
                <small class="text-body-secondary">${fecha1} - ${fecha2}</small>
            </div>
            <p class="mb-1" style="color: black">${task.Nota}.</p>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="button" class="btn btn-primary" data-id = "${doc.id}">Completar</button>
            </div>
            </a>
      
            <br><br><br>
            `;
        });
        //taskdone.innerHTML = html2;
        taskContainer.innerHTML = html1;

        const borrarBoton = taskContainer.querySelectorAll(".btn-primary");

        borrarBoton.forEach((btn) => {
          btn.addEventListener("click", ({ target: { dataset } }) => {
            deleteTask(dataset.id);
          });
        });
      });

      // ...
    } else {
      // User is signed out
      // ...
    }
  });
};

export const modEliTask = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Obtener el id del usuario actual
      const IdUsuario = user.uid;
      console.log(IdUsuario);
      //Se ob
      //Query para seleccionar los datos del Usuario actual
      const querySelection = query(
        collectionTask,
        where("IdUsuario", "==", IdUsuario)
      );

      const taskContainer = document.getElementById("list-container");
      const taskdone = document.getElementById("modTarea");
      // Obtener datos de usuario con respecto al id de la sesion actual
      getDocs(querySelection).then((querySnapshot) => {
        let html1 = "";
        querySnapshot.forEach((doc) => {
          const task = doc.data();
          const inifecha = task.inicioFecha.toDate();
          const fecha1 =
            "" +
            inifecha.getDate() +
            "/" +
            inifecha.getMonth() +
            "/" +
            inifecha.getFullYear();
          const finfecha = task.finFecha.toDate();
          const fecha2 =
            "" +
            finfecha.getDate() +
            "/" +
            finfecha.getMonth() +
            "/" +
            finfecha.getFullYear();

          html1 += `
            <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${task.NombreTarea}</h5>
                <small class="text-body-secondary">${fecha1} - ${fecha2}</small>
            </div>
            <p class="mb-1" style="color: black">${task.Nota}.</p>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="button" class="btn btn-primary" data-id = "${doc.id}" >Editar</button>
              <button class="btn btn-secondary" data-id = "${doc.id}" id="borrar">Borrar</button>
            </div>
            </a>
            <br><br><br>
            `;
        });
        //taskdone.innerHTML = html2;
        taskContainer.innerHTML = html1;

        const borrarBoton = taskContainer.querySelectorAll(".btn-secondary");

        borrarBoton.forEach((btn) => {
          btn.addEventListener("click", ({ target: { dataset } }) => {
            deleteTask(dataset.id);
          });
        });

        const mod = taskContainer.querySelectorAll(".btn-primary");

        mod.forEach((btn) => {
          btn.addEventListener("click", ({ target: { dataset } }) => {
            console.log(dataset.id);

            getDocs(querySelection).then((querySnapshot) => {
              let html5 = "";
              var elid;
              querySnapshot.forEach((doc) => {
                if (dataset.id == doc.id) {
                  const valores = doc.data();
                  html5 += `<form action="#" method="post">

                  <div class="container-fluid">
                    <div class="form-floating">
                      <textarea class="form-control" placeholder="Leave a comment here" id="NomTarea">${valores.NombreTarea}</textarea>
                      <label for="floatingTextarea" style="font-family:'American Typewriter', cursive ">Nombre de tarea:</label>
                    </div>
                    <br> <br />
                    <div>
                      <label for="customRange2" class="form-label" style="font-family:Comic Sans MS" style="color:aliceblue">
                        <FONT COLOR="white">Dificultad de tarea:
                      </label></FONT>
                      <input type="range" class="form-range" min="1" max="3" id="difTarea"/>
                    </div>
                    <div class="progress-stacked">
                      <div class="progress" role="progressbar" aria-label="Segment one" aria-valuenow="15" aria-valuemin="0"
                        aria-valuemax="100" style="width: 33%">
                        <div class="progress-bar bg-success">Facil</div>
                      </div>
                      <div class="progress" role="progressbar" aria-label="Segment two" aria-valuenow="30" aria-valuemin="0"
                        aria-valuemax="100" style="width: 33%">
                        <div class="progress-bar bg-warning">Mediana</div>
                      </div>
                      <div class="progress" role="progressbar" aria-label="Segment three" aria-valuenow="20" aria-valuemin="0"
                        aria-valuemax="100" style="width: 34%">
                        <div class="progress-bar bg-danger">Dificil</div>
                      </div>
                    </div>
                    <br> <br />
        
                    <h5 style="font-family:'American Typewriter', cursive ">Establecer fecha de inicio</h5>
                    <div class = "col-lg-8 col-sm-9">
                        <input id="startDate" class="form-control" type="datetime-local"/>
                        <span id="startDateSelected"></span>
                    </div>
                    <br> <br />
                    <h5 style="font-family:'American Typewriter', cursive ">Establecer fecha de fin</h5>
                    <div class = "col-lg-8 col-sm-9">
                        <input id="endDate" class="form-control" type="datetime-local" />
                        <span id="endDateSelected"></span>
                    </div>
                    <br>
                    <div class="form-floating">
                      <textarea class="form-control" placeholder="Leave a comment here" id="notasTarea"
                        style="height: 100px"></textarea>
                      <label for="floatingTextarea2" style="font-family:Comic Sans MS">Notas de tarea (Opcional)</label>
                    </div>
        
                    <input type="submit" value="EDITAR" id="edTask">
                </form>`;
                    elid = doc.id;
                  //
                }
              });
              taskdone.innerHTML = html5;
              const docRef = doc(db, "tareas", elid);
              document
                .getElementById("edTask")
                .addEventListener("click", (event) => {
                  event.preventDefault();
                  const nombre = document.getElementById("NomTarea").value;
                  const note = document.getElementById("notasTarea").value;
                  
                  const ini = document.getElementById("startDate").valueAsDate;
                  const fin = document.getElementById("endDate").valueAsDate;
                  const dif = document.getElementById("difTarea").value;

                  updateDoc(docRef, {
                    NombreTarea: nombre,
                    Nota: note,
                    inicioFecha: ini,
                    finFecha: fin,
                    Dificultad: dif,
                  })
                    .then(() => {
                      alert("se ha modificado una tarea")
                      console.log("Datos del cliente actualizados con éxito");
                    })
                    .catch((error) => {
                      console.error(
                        "Error al actualizar los datos del cliente:",
                        error
                      );
                    });
                });
            });
          });
        });
      });

      // ...
    } else {
      // User is signed out
      // ...
    }
  });
};

// Validate Functions
function validate_email(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    // Email is good
    return true;
  } else {
    // Email is not good
    return false;
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false;
  } else {
    return true;
  }
}

function validate_field(field) {
  if (field == null) {
    return false;
  }

  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}
