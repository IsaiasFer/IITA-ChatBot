const { addKeyword } = require("@bot-whatsapp/bot");
const revision = require("../revisionDeChat.js");
/* const { getUser, getTicket } = require("../api/users.service"); */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const isa = require("../modules/funcionesImportantes.js");

// modulos para usar logs internos dea
/* var require$$4 = require("console");
var require$$5 = require("fs");
const { Console } = require$$4;
const { createWriteStream } = require$$5; */

/**
 * Exportamos
 * @param {*} chatgptClass
 * @returns
 */
module.exports = {
  flowVenta: (chatgptClass) => {
    return addKeyword("1", {
      sensitive: true,
      /* regex:true  <-- Para expresiones Regulares*/
    })
      .addAction(async (ctx, { endFlow, flowDynamic, provider }) => {
        const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body,ctx);
        await flowDynamic(textFromAI.text);
        isa.insertarMensaje(
          ctx.nombre,
          textFromAI.text,
          ctx.fecha,
          ctx.timestamp,
          "bot"
        );
      })

      .addAnswer(
        "Cualquier consulta, no dudes en preguntarnos",
        { capture: true, delay: 0 },
        async (ctx, { fallBack, flowDynamic }) => {
          // ctx.body = es lo que la persona escribe!!

          if (!ctx.body.toLowerCase().includes("ofertas")) {
            const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body,ctx);
            isa.insertarMensaje(
              ctx.nombre,
              textFromAI.text,
              ctx.fecha,
              ctx.timestamp,
              "bot"
            );
            await fallBack(textFromAI.text);
          }
        }
      );
  },
};
