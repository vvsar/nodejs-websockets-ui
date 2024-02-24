import { Player } from "./player";
import { Request, RequestData } from "./types";
import { responseHandler } from "./utils";

const connections = new Set<Player>;

export const onConnect = (ws: WebSocket) => {
  ws.onmessage = (message: {data: string}) => {
    const req = JSON.parse(message.data) as Request;
    const {type: reqType, data: reqDataString} = req;
    const reqData: RequestData = JSON.parse(reqDataString)
    switch (reqType) {
      case 'reg':
        const player = new Player(reqData.name, reqData.password, ws);
        player.checkIfNameInUse(connections);
        if (!player.error) {
          connections.add(player);
        }
        const resData = {
          name: player.name,
          index: player.id,
          error: player.error,
          errorText: player.errorText,
        }
        ws.send(responseHandler('reg', resData));
        break;
      default:
        console.log('Unknown operation!');
        break;
    }
  };
  ws.onclose = () => {
    console.log('Websocket disconnected');
  }
}