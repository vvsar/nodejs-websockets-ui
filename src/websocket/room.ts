import { randomUUID } from "crypto";
import { PlayersSet, RoomUser, Ship } from "./types";
import { Player } from "./player";
import { responseHandler } from "./utils";
import { Game } from "./game";

export class Room {
  roomId: string;
  roomUsers: RoomUser[];
  numberOfUsersWithShips: number;
  game?: Game;

  constructor() {
    this.roomId = randomUUID();
    this.roomUsers = [];
    this.numberOfUsersWithShips = 0;
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
    const players = Array.from(allPlayers.values());
    const gamers: Player[] = [];
    this.roomUsers.forEach((user) => {
      const resData = { idGame: this.roomId, idPlayer: user.index };
      const gamer = players.find((player) => player.id === user.index);
      if (gamer) {
        gamers.push(gamer);
        gamer.ws.send(responseHandler('create_game', resData));
        numberOfResponses += 1;
      }
    });
    if (numberOfResponses === 2) {
      this.game = new Game(this.roomId, allPlayers, gamers);
      console.log(`Game [${this.roomId}] has been created.`);
    } else {
      console.log('Game was not created.');
    }
  }

  addShips(player: Player, ships: Ship[]) {
    player.ships = ships;
    console.log(`Player [${player.name}] added ships.`);
    this.numberOfUsersWithShips += 1;
    if (this.numberOfUsersWithShips === 2) {
      this.game?.start();
    }
  }
}