//serving the html page
import express from 'express';
import path, { dirname } from 'path';
import * as dotenv from 'dotenv';
import ejs from 'ejs';

dotenv.config();
const app = express();

const {
    IP_ADDR, //Address of the host. Ex: IP_ADDR="192.168.1.10"
    WS_PORT, //Port of the websocket server. Ex: WS_PORT=8080
    SERV_PORT, //Port of the HTML server. Ex: SERV_PORT=80
    DISCORD_WEBHOOK
} = process.env;




//Id generator
function generateUniqueId() {
    const chars = '0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }



//websocket server
import WebSocket, { WebSocketServer } from 'ws';
const wss = new WebSocketServer({port: WS_PORT})
wss.on('connection', (ws) => {
    ws.id = generateUniqueId();
    console.log(`Client [${ws.id}]connected!`)

    // Notify connection
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({name: 'SERVER', message: `User ${ws.id} has connected.`}))
    })

    ws.on('error', console.error);

    ws.on('message', async (data) => {
        let payload = JSON.parse(data);
        payload.id = ws.id;
        payload = JSON.stringify(payload);
        console.log(payload)
        wss.clients.forEach((client) => {
                client.send(`${payload}`)
        })
        if(DISCORD_WEBHOOK)
            sendToDiscord(data);
    })

    ws.on('close', (code) => {
        console.log('Client disconnected!')
        wss.clients.forEach((client) => {
            client.send(JSON.stringify({name: 'SERVER', message: `User ${ws.id} has disconnected.`}))
        })
    })


    //ws.send("something from back-end");
})


//Sending clients the front end
app.get('/', (req, res) => {
    // res.sendFile(path.resolve()+"/home.html");
    ejs.renderFile(`${path.resolve()}/views/home.ejs`, { ipaddr: IP_ADDR, wsport: WS_PORT}, (e, html) => {
        if (e){
            console.error(e);
        } else {
            res.send(html);
        }
    })
})


//Connection to Discord
const sendToDiscord = async (data) => {
    const initialData = JSON.parse(data);
    const payload = JSON.stringify({
        'content': initialData.message,
        'username': initialData.name
    })
    const res = await fetch(DISCORD_WEBHOOK, 
        {
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        })
}




app.listen(SERV_PORT, () => {
    console.log(`server listening on port ${SERV_PORT}`)
})