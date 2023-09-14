const { addKeyword } = require("@bot-whatsapp/bot");
/* const { getUser, getTicket } = require("../api/users.service");
const delay = (ms) => new Promise((res) => setTimeout(res, ms)); */
const isa = require("../modules/funcionesImportantes.js");

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
        const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body, ctx);
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
        //Este mensaje se envía siempre al inicio
        "Cualquier consulta, no dudes en preguntarnos",
        { capture: true, delay: 0 },
        async (ctx, { fallBack, flowDynamic }) => {
          // ctx.body = es lo que la persona escribe!!

          //TextFromAI es el mensaje generado por ChatGPT
          const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body, ctx);
          //Aquí se guarda el mensaje en la DB
          isa.insertarMensaje(
            ctx.nombre,
            textFromAI.text,
            ctx.fecha,
            ctx.timestamp,
            "bot"
          );
          //Aquí se envía el mensaje y se crea un ciclo que itera en esta ultima parte todo el tiempo (recibir msj, analizar, responder)
          await fallBack(textFromAI.text);
        }
      );
  },
};
