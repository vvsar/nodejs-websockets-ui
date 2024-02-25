import { Player } from "./player";
import { responseHandler } from "./utils";

export class Game {
  idGame: string;
  allPlayers: Player[];
  gamers: Player[];
  attacker: Player;
  defender: Player;

  constructor(idGame: string, allPlayers: Player[], gamers: Player[]) {
    this.idGame = idGame;
    this.allPlayers = allPlayers;
    this.gamers = gamers;
    this.attacker = gamers[0];
    this.defender = gamers[1];
    
  }

  start() {
    this.gamers.forEach((gamer) => {
      gamer.shipsLeft = 10;
      gamer.ws.send(responseHandler('start_game', {
        ships: gamer.ships,
        currentPlayerIndex: gamer.id,
      }));
      gamer.ws.send(responseHandler('turn', { currentPlayer: this.attacker.id }));
    });
    console.log(`Game [${this.idGame}] started.`);
  }


}