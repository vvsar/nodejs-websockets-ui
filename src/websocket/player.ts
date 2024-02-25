import { randomUUID } from "crypto";
import { PlayersSet } from "./types";
import { Ship } from "./types";

export class Player {
  name: string;
  password: string;
  id: string;
  ws: WebSocket;
  error: boolean;
  errorText: string;
  wins: number;
  shipsLeft: number;
  ships?: Ship[];

  constructor(name: string, password: string, ws: WebSocket) {
    this.name = name;
    this.password = password;
    this.id = randomUUID();
    this.ws = ws;
    this.error = false;
    this.errorText = '';
    this.wins = 0;
    this.shipsLeft = 0;
  }

  getRegInfo() {
    return {
      name: this.name,
      index: this.id,
      error: this.error,
      errorText: this.errorText,
    }
  }

  checkIfNameInUse(allPlayers: PlayersSet) {
    const players = Array.from(allPlayers.values());
    this.error = players.some((player) => player.name === this.name);
    if (this.error) {
      this.errorText = `The name ${this.name} is in use already. Please choose another one`;
    }
  }
}