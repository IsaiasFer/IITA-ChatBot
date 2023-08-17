require("dotenv").config();
const { join } = require("path");
const { readFileSync } = require("fs");

const getPrompt = async () => {
  const pathPromp = join(process.cwd(), "prompts");
  const text = readFileSync(join(pathPromp, "prompt.txt"), "utf-8");
  return text;
};

// Variables creadas por Isaias
let numbersDiccionary = {};
let conversaciones = [];
class ChatGPTClass {
  queue = [];
  optionsGPT = { model: "gpt-4" };
  openai = undefined;

  constructor() {
    this.init().then();
  }

  /**
   * Esta funciona inicializa
   */
  init = async () => {
    const { ChatGPTAPI } = await import("chatgpt");
    this.openai = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
      systemMessage: await getPrompt(),
      n: 1,
    });
  };

  /* *
   * Manejador de los mensajes
   * sun funcion es enviar un mensaje a wahtsapp
   * @param {*} ctx
   */

  // Este codigo se ejecuta cada vez que se recibe un mensaje a IITA
  handleMsgChatGPT = async (body, ctx) => {
    // Numero de telefono de la persona que manda el mensaje
    let numeroDelCliente = ctx.from;

    // Comprueba si ya existe un historial con el cliente. SI no existe, crea un array vacío para empezarlo
    if (!conversaciones[numeroDelCliente]) {
      conversaciones[numeroDelCliente] = []
    }

    // Solo sirve para entender mejor el código
    let mensajesDelCliente=conversaciones[numeroDelCliente]


    // Comprueba si el número que envió mensaje ya está registrado en el diccionario de números
    if (!Object.keys(numbersDiccionary).includes(`${numeroDelCliente}`)) {
      console.log("Este numero no estaba registrado, lo registrare")
      numbersDiccionary[numeroDelCliente] =
        Object.keys(numbersDiccionary).length;
    }

    // Le proprociona contexto al mensaje de ChatGPT, mediante su ID de conversación y el mensaje anterior o ensaje "Padre" este código sirve para que el ChatBot sea multicanal y mantenga información diferenciada por cada chat.
    const interaccionChatGPT = await this.openai.sendMessage(body, {
      conversationId: numbersDiccionary[numeroDelCliente],
      parentMessageId: mensajesDelCliente.length==0
        ? undefined
        : mensajesDelCliente[mensajesDelCliente.length - 1].id,
    });

    // Este código agrega el último mensaje que mandó el chatbot a la cadena de mensajes historicos
    mensajesDelCliente.push(interaccionChatGPT);

/*     console.log("esta es la lista de mensaje que se enviaron: ");
    console.log(mensajesDelCliente); */
    return interaccionChatGPT;
  };
}

module.exports = ChatGPTClass;
