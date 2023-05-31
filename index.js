// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase,ref,onValue} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
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
  appId: "1:673913631253:web:fc9492778e94da7e6f941c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();

function obtenerMensajes(){
    const dbRef=ref(db,"/")
    let container=document.getElementById('hola')

    onValue(dbRef,(snapshot)=>{
        var respuesta=[]
        let contenedor=document.createElement("div")
        snapshot.forEach(childSnapshots => {
            respuesta.push(childSnapshots.val())
        });

        respuesta=Object.entries(respuesta)
        var cliente=Object.entries(respuesta[0][1])
        
        for (let i = 0; i <  cliente.length; i++) {
            var objetoMensaje=Object.values(cliente[i][1])
            var nombreDeCliente=cliente[i][0]
            contenedor.append(`Los siguientes mensajes corresponden a ${nombreDeCliente}: \n`)
            for (let i = 0; i < objetoMensaje.length; i++) {
                var mensaje=objetoMensaje[i].mensaje
                let p = document.createElement("p");
                p.append(mensaje)
                if (objetoMensaje[i].origen=="bot"){
                    p.classList.add("botMsj")
                }else{
                    p.classList.add("clientMsj")
                }
                contenedor.append(p)
            }
        }
        if (container.firstElementChild){
            container.replaceChild(contenedor,container.firstElementChild)
        }else{
            container.append(contenedor)
        }
        
    })
}

window.onload=obtenerMensajes
