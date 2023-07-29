// Esta funcion es para registrar el mensaje en la base de datos
// Modulos para la Bases de datos externas
// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// COnfiguracion de la conexion con Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEkrWjltWRM9R6mGqS13HWdNKFmTJcYPo",
  authDomain: "chatbot-iita.firebaseapp.com",
  databaseURL: "https://chatbot-iita-default-rtdb.firebaseio.com",
  projectId: "chatbot-iita",
  storageBucket: "chatbot-iita.appspot.com",
  messagingSenderId: "673913631253",
  appId: "1:673913631253:web:fc9492778e94da7e6f941c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
} = require("firebase/database");
const db = getDatabase();

function insertarMensaje(user, mensaje, fechita, timestampi,origen) {
    set(ref(db, "chats/" + user + "/" + timestampi+"I"), {
      mensaje: mensaje,
      fecha: fechita,
      origen: origen,
      enviado: "no",
    }).catch((e) => {
      console.log("Chango pasó un error :( , es el siguiente: ", e);
    });
  }

  module.exports = {
    "insertarMensaje": insertarMensaje
}