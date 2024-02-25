import { Player } from "./player";
import { Room } from "./room";
import { Request, RegData } from "./types";
import { findUserByWs, responseHandler } from "./utils";

const connections = new Set<Player>;
const rooms: Room[] = [];

export const onConnect = (ws: WebSocket) => {
  ws.onmessage = (message: { data: string }) => {
    const req = JSON.parse(message.data) as Request;
    const {type: reqType, data: reqDataString} = req;
    switch (reqType) {
      case 'reg':
        const reqData: RegData = JSON.parse(reqDataString);
        const player = new Player(reqData.name, reqData.password, ws);
        player.checkIfNameInUse(connections);
        if (!player.error) {
          connections.add(player);
          console.log(`User ${player.name} has been created with id ${player.id}.`);
        }
        const resData = player.getRegInfo();
        ws.send(responseHandler('reg', resData));
        break;
      case 'create_room':
        const room = new Room();
        console.log(`Room with id ${room.roomId} has been created.`)
        const user = findUserByWs(connections, ws);
        if (user) {
          room.addUser(user);
          console.log(`User ${user.name} has been added to room with id ${room.roomId}.`)
        } else {
          console.log('Addition of user to room failed.');
        }
        rooms.push(room);
        break;
      case 'update_room':
        //
        break;
      case 'add_user_to_room':
        //
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