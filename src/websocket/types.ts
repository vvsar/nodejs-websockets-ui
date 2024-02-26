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
  hiddenCells?: number,
  shotCells?: [number, number][],
}

export type AddShipsData = {
  gameId: string,
  ships: Ship[],
  indexPlayer: string,
}

export type AttackData = {
  gameId: string,
  x: number,
  y: number,
  indexPlayer: string,
}

export type RandomAttackData = {
  gameId: string,
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

export type Cell = {
  isEmpty: boolean,
  revealed: boolean,
  ship?: Ship,
}

export type SurroundingCell = {
  x: number,
  y: number,
}
