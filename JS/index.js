import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
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
  onSnapshot,
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
      window.location.pathname = "/newpage.html";
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
          window.location.pathname = "/newpage.html";
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
      //Se ob
      //Query para seleccionar los datos del Usuario actual
      const querySelection = query(
        collectionUsers,
        where("IdUsuario", "==", IdUsuario)
      );
      // Obtener datos de usuario con respecto al id de la sesion actual
      getDocs(querySelection).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //Se escriben en consola los datos
          console.log(doc.data());
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
