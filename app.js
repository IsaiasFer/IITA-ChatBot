//Para usar variables de entorno
require("dotenv").config();

const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

//Par usar funciones propias
const isa = require("./modules/funcionesImportantes.js");

const MetaProvider = require("@bot-whatsapp/provider/meta");
const MockAdapter = require("@bot-whatsapp/database/mock");

/* ChatGPT */
const ChatGPTClass = require("./chatgpt.class");
const chatGPT = new ChatGPTClass();

/* Importamos el flow que utiliza ChatGPT */
const { flowVenta } = require("./flows/flowVenta.js");

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

const flowSecundario = addKeyword(["2", "siguiente"]).addAnswer([
  "📄 Aquí tenemos el flujo secundario",
]);

const flowGus = addKeyword(["gus", "gustavo", "profesor gustavo"]).addAnswer(
  [
    "Bienvenido Profesor Gustavo",
    "Por ahora no hay mucho que ver aqui",
    "Seguimos probando flujos",
  ],
  null,
  null,
  [flowSecundario]
);

const flowClientes = addKeyword(["tutorial", "tuto"]).addAnswer(
  [
    "Gracias por venir a comprar, ahora estamos desarrollando pero pronto podremos atnederte de mejor manera",
    "Hasta eso, Adios",
  ],
  null,
  null,
  [flowSecundario]
);

const flowIsa = addKeyword(["isaias", "isa"]).addAnswer(
  ["Bienvenido Isaias", "We have to keep coding for the IITA Chatbot!"],
  null,
  null,
  [flowSecundario]
);

const flowSocial = addKeyword([
  "redes",
  "social",
  "facebook",
  "instagram",
]).addAnswer(
  ["Sigue a IITA en Facebook, Instagram y GitHub, (No sé si hay)"],
  null,
  null,
  [flowSecundario]
);

const flowPrincipal = addKeyword(["hola", "pepe"])
  .addAnswer(
    "Hola, bienvenido al ChatBot del *Instituto de Innovación y Tecnología Aplicada*!",
    null,
    async (ctx) => {
      isa.insertarMensaje(
        ctx.nombre,
        "Aqui iria el mensaje de el chatBot",
        ctx.fecha,
        ctx.timestamp,
        "bot"
      );
    }
  )
  .addAnswer(
    [
      "Quien eres?",
      "👉 *gus* si eres el profe Gustavo",
      "👉 *isa*  si eres Isaias",
      "👉 *cliente* si eres un cliente de IITA 3D",
    ],
    null,
    async (ctx) => {
      isa.insertarMensaje(
        ctx.nombre,
        "Aqui iria el mensaje de el chatBot",
        ctx.fecha,
        ctx.timestamp,
        "bot"
      );
    },
    [flowGus, flowIsa, flowClientes, flowSocial]
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  //Aquí se van a incluir los Lfujos que desaeamos utilizar, entre todos los que utilizamos
  const adapterFlow = createFlow([flowVenta(chatGPT)], [flowPrincipal]);
  //Configuración para el envío de mensajes
  const adapterProvider = createProvider(MetaProvider, {
    jwtToken: process.env.META_KEY,
    numberId: 100436536473788,
    verifyToken: "HAPPY",
    version: "v17.0",
  });

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
};

main();