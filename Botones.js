/* var request = require('request'); */
/* require('dotenv').config() */
/* const {MetaProvider} = require("@bot-whatsapp/provider/meta"); */
/* import MetaProvider from '/node_modules/@bot-whatsapp/provider/lib/meta/index.js' */
sendMessageMeta = async (cuerpo) => {
  try {
    const respuesta = await fetch(
      `https://graph.facebook.com/v17.0/100436536473788/messages`,
      cuerpo,
      {
        headers: {
          'Authorization': `Bearer EABYCzV8MeAIBOx2L3lO69GTMHJ6BlJ1Kq1p78ZCOlLFcY2xcO4gTln4vwYeRfH1gbsiitRjUcLbG0YsBVZBmkNyR9x5ZAmrNcJnVb2kpC7QiwcToNxuUfLyvsQtn9bbRBLD1lRE1JEQ5nRjXnoD8QxMkRZB6y4tYQFjaA7ZAPHf4gOHtKvODgbRlSgFuJcb7B8DjRaWu7NP2ASGCnv3sEMZA9zyNUCm6LFDyoZD`,
        },
      },
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((response) =>
        console.log("crack, la respuesta es \n", JSON.stringify(response))
      )
      .catch((error) => console.log("paso un error hermano: \n", error));
    return respuesta;
  } catch (error) {
    console.log("Salio todo mal manito:", error);
  }
};

enviarMensaje = async (number, message) => {
  const body = {
    messaging_product: "whatsapp",
    to: number,
    type: "text",
    text: {
      preview_url: false,
      body: message,
    },
  };
  return sendMessageMeta(body);
};

var boton1 = document.getElementById("sendMessage");

boton1.addEventListener("click", function () {
  enviarMensaje(54387154123594, "Holaaa que ondaa");
});
