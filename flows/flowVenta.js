const { addKeyword } = require("@bot-whatsapp/bot");
const revision = require("../revisionDeChat.js");
/* const { getUser, getTicket } = require("../api/users.service"); */
const { readFileSync } = require("fs");
const { join } = require("path");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

// Esta funcion es para registrar el mensaje en la base de datos
function insertarMensaje(user, mensaje, fechita, timestampi) {
  set(ref(db, "chats/" + user + "/" + timestampi+"I"), {
    mensaje: mensaje,
    fecha: fechita,
    origen: "bot",
    enviado: "no",
  }).catch((e) => {
    console.log("Chango pasó un error :( , es el siguiente: ", e);
  });
}

// modulos para usar logs internos dea
/* var require$$4 = require("console");
var require$$5 = require("fs");
const { Console } = require$$4;
const { createWriteStream } = require$$5; */

/**
 * Recuperamos el prompt "TECNICO"
*/
const getPrompt = async () => {
  const pathPromp = join(process.cwd(), "prompts");
  const text = readFileSync(join(pathPromp, "01_VENTA.txt"), "utf-8");
  return text;
};

/**
 * Exportamos
 * @param {*} chatgptClass
 * @returns
 */
module.exports = {
  flowVenta: (chatgptClass) => {
    return addKeyword("1", {
      sensitive: true,
      /* regex:true */
    })
      .addAction(async (ctx, { endFlow, flowDynamic, provider }) => {
        await flowDynamic("El siguiente mensaje será hecho por ChatGPT");

        /*         const jid = ctx.key.remoteJid;
        const refProvider = await provider.getInstance();

        await refProvider.presenceSubscribe(jid);
        await delay(500);

        await refProvider.sendPresenceUpdate("composing", jid); */

        /*         const user = await getUser(ctx.from); //Consultamos a strapi! ctx.from = numero

        const lastTicket = await getTicket(user[0].id);

        if (!lastTicket.data.length) {
          await flowDynamic("No tienes ticket abierto!");
          return endFlow();
        }

        const listTickets = lastTicket.data
          .map(
            (i) =>
              `ID_REF:${i.id}, cliente:${user[0].username}, model:${i.attributes.model}, description: ${i.attributes.description}, status:${i.attributes.status}`
          )
          .join("\n"); */

        const data = await getPrompt();

        await chatgptClass.handleMsgChatGPT(data); //Dicinedole actua!!

        const textFromAI = await chatgptClass.handleMsgChatGPT(`${ctx.body}`);

        /* Aqui se registra en un txt el mensaje que va a enviar ChatGPT */
        /* logger = new Console({
          stdout: createWriteStream(`${process.cwd()}/chats/${ctx.nombre}.json`, {
            flags: "a",
          }),
        });
        logger.log(
          "{'ChatGPT envió el mensaje",
          textFromAI.text,
          "el día de hoy'}"
        ); */
        /* console.log(revision(textFromAI.text)); */
        await flowDynamic(textFromAI.text);
        insertarMensaje(ctx.nombre, textFromAI.text, ctx.fecha, ctx.timestamp);
      })

      .addAnswer(
        "Cualquier consulta, no dudes en preguntarnos",
        { capture: true, delay: 0 },
        async (ctx, { fallBack, flowDynamic }) => {
          // ctx.body = es lo que la persona escribe!!

          if (!ctx.body.toLowerCase().includes("ofertas")) {
            const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body);
            insertarMensaje(
              ctx.nombre,
              textFromAI.text,
              ctx.fecha,
              ctx.timestamp
            );
            await fallBack(textFromAI.text);
          }
        }
      );
  },
};
