import { Player } from "./player";
import { Room } from "./room";
import { Request, RegData, AddUserData, Winner } from "./types";
import { findUserByWs, responseHandler, updateRoom, updateWinners } from "./utils";

const connections = new Set<Player>;
const rooms: Room[] = [];
const winners: Winner[] = [];

export const onConnect = (ws: WebSocket) => {
  ws.onmessage = (message: { data: string }) => {
    const req = JSON.parse(message.data) as Request;
    const {type: reqType, data: reqDataString} = req;
    switch (reqType) {
      case 'reg':
        const regData: RegData = JSON.parse(reqDataString);
        const player = new Player(regData.name, regData.password, ws);
        player.checkIfNameInUse(connections);
        if (!player.error) {
          connections.add(player);
          console.log(`User [${player.name}] has been created with id [${player.id}].`);
        }
        const resData = player.getRegInfo();
        ws.send(responseHandler('reg', resData));
        updateRoom(rooms, connections);
        updateWinners(winners, connections);
        break;
      case 'create_room':
        const room = new Room();
        console.log(`Room [${room.roomId}] has been created.`)
        const user = findUserByWs(connections, ws);
        if (user) {
          room.addUser(user);
          rooms.push(room);
          updateRoom(rooms, connections);
          updateWinners(winners, connections);
        } else {
          console.log('Addition of user to room failed.');
        }
        break;
      case 'add_user_to_room':
        const addUserData: AddUserData = JSON.parse(reqDataString);
        const userToAdd = findUserByWs(connections, ws);
        const roomToUpdate = rooms.find((room) => room.roomId === addUserData.indexRoom);
        if (userToAdd && roomToUpdate) {
          roomToUpdate.addUser(userToAdd);
          updateRoom(rooms, connections);
        } else {
          console.log('Addition of user to room failed.');
        }
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