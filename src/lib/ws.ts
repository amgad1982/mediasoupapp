import WebSocket from "ws";
import { createWorker } from "./worker";

let mediasoupRouter;
const WebsocketConnection = async (websocket: WebSocket.Server) => {
  try {
    mediasoupRouter = await createWorker();
  } catch (error) {
    throw error;
  }

  websocket.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      console.log("Message: =>", message);
      ws.send("Hello!");
    });
  });
};

export { WebsocketConnection };
