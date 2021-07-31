import express from 'express';
import * as http from 'http';
import * as Websocket from 'ws';
import { WebsocketConnection } from './lib/ws';


const main = async () => {
    const app = express();
    const server = http.createServer(app);
    const w_socket = new Websocket.Server({ server, path: '/ws' });

    WebsocketConnection(w_socket);
    const port = 8000;
    server.listen(port, () => {
        console.log("Server Running on port ", port);
    });



}

export { main }