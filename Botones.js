/* var request = require('request'); */
require('dotenv').config()
import request from 'C:\Users\isafe\OneDrive\Documentos\Software\IITA\chatBot\base-meta-memory\node_modules\request'

sendMessageMeta = async (body) => {
    try {
        const response = await request.post(
            `https://graph.facebook.com/v16.0/110066822076442/messages`, body, {
                    headers: {
                        Authorization: `Bearer ${process.env.META_KEY}`,
                    },
                },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
        );
        /* const response = await axios.post(`https://graph.facebook.com/v16.0/110066822076442/messages`, body, {
            headers: {
                Authorization: `Bearer ${process.env.META_KEY}`,
            },
        }); */
        return response.data
    } catch (error) {
        console.log('Hubo un error pibardo: ', error);
        return Promise.resolve(error)
    }
}

enviarMensaje = async (number, message) => {
    const body = {
        messaging_product: 'whatsapp',
        to: number,
        type: 'text',
        text: {
            preview_url: false,
            body: message,
        },
    };
    return this.sendMessageMeta(body)
}

enviarMensaje(54387154123594,'que onda crack')