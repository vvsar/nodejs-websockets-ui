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
    this.roomUsers.push({name: user.name, index: user.id});
  }
}