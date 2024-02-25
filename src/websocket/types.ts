import { Player } from "./player";

export type PlayersSet = Set<Player>;

export type RegData = {
  name: string,
  password: string,
}

export type AddUserData = {
  indexRoom: string,
}

export type Request = {
  type: string,
  data: string,
  id: 0.
};

export type RoomUser = {
  name: string,
  index: string,
}

export type Winner = {
  name: string,
  wins: number,
}
