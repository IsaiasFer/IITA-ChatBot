// Import the functions you need from the SDKs you need
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEkrWjltWRM9R6mGqS13HWdNKFmTJcYPo",
  authDomain: "chatbot-iita.firebaseapp.com",
  databaseURL: "https://chatbot-iita-default-rtdb.firebaseio.com",
  projectId: "chatbot-iita",
  storageBucket: "chatbot-iita.appspot.com",
  messagingSenderId: "673913631253",
  appId: "1:673913631253:web:fc9492778e94da7e6f941c",
};

// Iniciar Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
const dbRef = ref(db, "/");

//Esta función sirve para Cargar la lista de clientes que alguna vez mandaron mensajes, en la columna izquierda, y les agrega funcionalidad
function ObtenerClientes() {
  let clienteIncluidos = [];
  let container = document.getElementById("chats");
  onValue(dbRef, (snapshot) => {
    var respuesta = [];
    snapshot.forEach((childSnapshots) => {
      respuesta.push(childSnapshots.val());
    });

    respuesta = Object.entries(respuesta);
    var cliente = Object.entries(respuesta[0][1]);

    for (let i = 0; i < cliente.length; i++) {
      let contenedor = document.createElement("div");
      let nombreInterfaz = document.createElement("p");
      var nombreDeCliente = cliente[i][0];
      if (!clienteIncluidos.includes(`${nombreDeCliente}`)) {
        clienteIncluidos.push(nombreDeCliente);
        nombreInterfaz.append(`${nombreDeCliente}`);
        nombreInterfaz.classList.add("nombreDelCliente");
        contenedor.append(nombreInterfaz);
        contenedor.classList.add("chat");
        contenedor.onclick = function () {
          obtenerMensajes(cliente[i][0]);
        };
        container.append(contenedor);
      }
      var ventanaMensajes = document.querySelector(".mensajes");
      ventanaMensajes.scrollTop = ventanaMensajes.scrollHeight;
    }
  });
}

function obtenerMensajes(clienteLlamado) {
  onValue(dbRef, (snapshot) => {
    let container = document.getElementById("hola");
    let contenedor = document.createElement("div");
    var respuesta = [];

    snapshot.forEach((childSnapshots) => {
      respuesta.push(childSnapshots.val());
    });

    respuesta = Object.entries(respuesta);
    var cliente = Object.entries(respuesta[0][1]);

    for (let i = 0; i < cliente.length; i++) {
      var nombreDeCliente = cliente[i][0];

      if (clienteLlamado == nombreDeCliente) {
        var objetoMensaje = Object.values(cliente[i][1]);

        // Recorremos todos los mensajes que hayan sido enviados, sea por usuario o ChatBot
        for (let i = 0; i < objetoMensaje.length; i++) {
          // guardamos el texto del mensaje en la variable mensaje
          var mensaje = objetoMensaje[i].mensaje;
          // Se crea elemento parrafo y le agregamos el texto del mensaje
          let p = document.createElement("p");
          p.append(mensaje);
          // Selección de cada mensaje uno por uno para colocarle clases distintas en HTML según por quien haya sido enviado
          if (objetoMensaje[i].origen == "bot") {
            p.classList.add("botMsj");
          } else {
            p.classList.add("clientMsj");
          }
          contenedor.append(p);
        }
        if (container.firstElementChild) {
          container.replaceChild(contenedor, container.firstElementChild);
        } else {
          container.append(contenedor);
        }
      }
    }
    var ventanaMensajes = document.querySelector(".mensajes");
    ventanaMensajes.scrollTop = ventanaMensajes.scrollHeight;
  });
}

function ultimoMensaje() {
  // Funciones pra obtener mensajes del Bot
  /*   let listaMensajesBot = [];
    for (let i = 0; i < objetoMensaje.length; i++) {
      var mensaje = objetoMensaje[i];
      if (mensaje.origen == "bot") {
        // Ultimo Mensaje del Bot
        listaMensajesBot.push(mensaje.mensaje);
      }
    } */
}

function iniciar() {
  ObtenerClientes();
}

window.onload = iniciar;
