
import WebSocket from "ws";
import { createWorker } from "./worker";
import { Producer, Router , Transport} from 'mediasoup/lib/types';
import { createWebRtcTransport } from "./createWebrtcTransport";

let mediasoupRouter: Router;
let producerTransport: Transport;
let producer: Producer;
const WebsocketConnection = async (websocket: WebSocket.Server) => {
  try {
    mediasoupRouter = await createWorker();
  } catch (error) {
    throw error;
  }

  websocket.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      const isValidJSON = IsJsonString(message);
      if (!isValidJSON) {
        console.error("json error:", message);
        return
      }
      const event = JSON.parse(message);
      switch (event.type) {
        case "getRouterRtpCapabilities":
          onRouterRtpCapabilities(event,ws)
          break;
        case "createProducerTransport":
          onCreateProducerCapabilities(event, ws);
          break;
        case "connectProducerTransport":
          onConnectProducerTransport(event, ws);
          break;
        case "produce":
          onProduce(event, ws,websocket);
          break;
        default:
          break;
      }

    });
  });

  const onProduce = async (event: any, ws: WebSocket,websocketServer:WebSocket.Server) => {
    const { kind, rtpParameters } = event;
    producer = await producerTransport.produce({ kind, rtpParameters });
    const resp = {
      id:producer.id
    }
    send(ws, 'produced', resp);
    broadcast(websocketServer, 'newProducer', 'new user');
  }

  const onConnectProducerTransport = async (event: any, ws: WebSocket) => {
    await producerTransport.connect({ dtlsParameters: event.dtlsParameters });
    send(ws, "producerConnected", "producer connected!");
  }

  const onRouterRtpCapabilities = (event: string, ws: WebSocket) => {
    send(ws, "routerCapabilities", mediasoupRouter.rtpCapabilities);
  };

  const onCreateProducerCapabilities =async  (event: string, ws: WebSocket) => {
    try {
      const { transport, params} = await createWebRtcTransport(mediasoupRouter);
      producerTransport = transport;
      send(ws, "producerTransportCreated", params);
    } catch (error) {
      console.error(error);
      send(ws, "error", error);
    }
  }

  const IsJsonString = (str: string) => {
    try {
      JSON.parse(str);
    } catch (error) {
      return false;
    }
    return true;
  }

  const send = (ws: WebSocket, type: string, msg: any)=>{
    const message= {
      type,
      data: msg
    };
    const resp = JSON.stringify(message);
    ws.send(resp);
  }

  const broadcast = (ws: WebSocket.Server, type: string, msg: any) => {
    const message = {
      type,
      data:msg
    }

    const resp = JSON.stringify(msg);
    ws.clients.forEach(client => {
      client.send(resp);
    });
  }
};

export { WebsocketConnection };
