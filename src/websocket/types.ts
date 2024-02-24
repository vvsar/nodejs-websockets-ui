import { Player } from "./player";

export type PlayersSet = Set<Player>;

export type RequestData = {
  name: string,
  password: string,
}

export type Request = {
  type: string,
  data: string,
  id: 0.
};
