# localChatBot

Just a small project that utilizes websockets in order to host a live chatting service on a local (and now remote) network. 

* This was intentionally designed to work locally, but now .env has been configured where you can specify outside port for http & websocket server.

Include this in your .env: 

IP_ADDR="192.168.1.10" 
* Ip address of local network if hosting locally, or external ip address if hosting on internet

WS_PORT=8080
* Port to host websocket server.

SERV_PORT=3000
* Port to host http server. 
