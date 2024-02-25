import { randomUUID } from "crypto";
import { RoomUser } from "./types";
import { Player } from "./player";

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
}