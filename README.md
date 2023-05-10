# localChatBot

Just a small project that utilizes websockets in order to host a live chatting service on a local (and now remote) network. 

* This was intentionally designed to work locally, but now .env has been configured where you can specify outside port for http & websocket server.

## Include this in your .env: 

IP_ADDR="192.168.1.10" 
* Ip address of local network if hosting locally, or external ip address if hosting on internet

WS_PORT=8080
* Port to host websocket server.

SERV_PORT=3000
* Port to host http server.

### Optional

DISCORD_WEBHOOK="https://discord.com/api/webhooks/x/x"
* Webhook connection to send all client messages.

## What's new 
#### Log chatroom to Discord via Webhook
* Simply add a webhook URL for your discord guild to the .env file to get all chats on disord in real time.
    * [Tutorial on Discord Webhooks](https://www.youtube.com/watch?v=zxi926qhP7w)
