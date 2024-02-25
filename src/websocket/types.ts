import { Player } from "./player";

export type PlayersSet = Set<Player>;

export type RegData = {
  name: string,
  password: string,
}

export type AddUserData = {
  indexRoom: string,
}

export type Ship = {
  position: {
    x: number,
    y: number,
  },
  direction: boolean,
  length: number,
  type: 'small' | 'medium' | 'large' | 'huge',
}

export type AddShipsData = {
  gameId: string,
  ships: Ship[],
  indexPlayer: string,
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

// export type Winner = {
//   name: string,
//   wins: number,
// }
