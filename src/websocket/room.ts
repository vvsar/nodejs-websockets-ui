import { randomUUID } from "crypto";
import { PlayersSet, RoomUser } from "./types";
import { Player } from "./player";
import { responseHandler } from "./utils";

export class Room {
  roomId: string;
  roomUsers: RoomUser[];

  constructor() {
    this.roomId = randomUUID();
    this.roomUsers = [];
  }

  addUser(user: Player) {
    const foundUser = this.roomUsers.find((userInRoom) => user.id === userInRoom.index);
    if (!foundUser) {
      this.roomUsers.push({name: user.name, index: user.id});
      console.log(`User [${user.name}] has been added to room [${this.roomId}].`);
    }
  }

  createGame(allPlayers: PlayersSet) {
    let numberOfResponses = 0;
    this.roomUsers.forEach((user) => {
      const resData = { idGame: this.roomId, idPlayer: user.index };
      const players = Array.from(allPlayers.values());
      const gamer = players.find((player) => player.id === user.index);
      if (gamer) {
        gamer.ws.send(responseHandler('create_game', resData));
        numberOfResponses += 1;
      }
    });
    if (numberOfResponses === 2) {
      console.log(`Game [${this.roomId}] has been created`);
    } else {
      console.log('Game was not created.');
    }
  }
}