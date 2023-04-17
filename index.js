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
    SERV_PORT //Port of the HTML server. Ex: SERV_PORT=80
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

    ws.on('message', (data) => {
        let payload = JSON.parse(data);
        payload.id = ws.id;
        payload = JSON.stringify(payload);
        console.log(payload)
        wss.clients.forEach((client) => {
                client.send(`${payload}`)
        })
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




app.listen(SERV_PORT, () => {
    console.log(`server listening on port ${SERV_PORT}`)
})