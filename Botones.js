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
          Authorization: 'Bearer EABYCzV8MeAIBO3ylURKMnhTNgqHLAKP6N0Vja0WlSSkEHYwRE1oliNMPPOewT9MHvvaMJ8G0NDrgvxUZCpaWIff8SIq0XSFaQ4NG3hFeGSNDPCMA2pBNu3hBBt3MhoxvV4hPgD7KdAkS198oJxYbmTCkxSZBWGwpwL1Lrg2d1UrfQCZCZBWiIXbAs3M1iV1ixEBpZAaia2tJLQng2f1aMtHGb8Km5nuKPHOoxV8vvucAD39Ecfn8g',
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
