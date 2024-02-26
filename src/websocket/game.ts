import { Player } from "./player";
import { PlayersSet } from "./types";
import { createField, getSurroundingCells, responseHandler, updateWinners } from "./utils";

export class Game {
  idGame: string;
  allPlayers: PlayersSet;
  gamers: Player[];
  attacker: Player;
  defender: Player;

  constructor(idGame: string, allPlayers: PlayersSet, gamers: Player[]) {
    this.idGame = idGame;
    this.allPlayers = allPlayers;
    this.gamers = gamers;
    this.attacker = gamers[0];
    this.defender = gamers[1];
    
  }

  start() {
    this.gamers.forEach((gamer) => {
      if (gamer.ships) {
        gamer.field = createField(gamer.ships);
      }
      gamer.shipsLeft = 10;
      gamer.ws.send(responseHandler('start_game', {
        ships: gamer.ships,
        currentPlayerIndex: gamer.id,
      }));
      gamer.ws.send(responseHandler('turn', { currentPlayer: this.attacker.id }));
    });
    console.log(`Game [${this.idGame}] started.`);
  }

  attack(id: string, x: number, y: number) {
    if (id === this.defender.id) return;
    const cell = this.defender.field![x][y];
    if (cell.revealed) {
      this.gamers.forEach((gamer) => {
        gamer.ws.send(responseHandler('turn', { currentPlayer: this.attacker.id }));
      });
      return;
    }
    cell.revealed = true;
    const resData = {
      position: { x: x, y: y },
      currentPlayer: id,
      status: '',
    };
    if (cell.isEmpty) {
      resData.status = 'miss';
      this.gamers.forEach((gamer) => {
        gamer.ws.send(responseHandler('attack', resData));
      });
      this.exchangeRoles();
    } else {
      if (cell.ship?.hiddenCells) {
        cell.ship.hiddenCells -= 1;
      }
      if (cell.ship?.shotCells) {
        cell.ship.shotCells.push([x, y]);
      }
      if (cell.ship?.hiddenCells && cell.ship.hiddenCells > 0) {
        resData.status = 'shot';
        this.gamers.forEach((gamer) => {
          gamer.ws.send(responseHandler('attack', resData));
        });
        this.gamers.forEach((gamer) => {
          gamer.ws.send(responseHandler('turn', { currentPlayer: this.attacker.id }));
        });
      } else {
        if (cell.ship?.shotCells) {
          cell.ship.shotCells.forEach((item) => {
            const resData = {
              position: { x: item[0], y: item[1] },
              currentPlayer: id,
              status: 'killed',
            };
            this.gamers.forEach((gamer) => {
              gamer.ws.send(responseHandler('attack', resData));
            });
          });
          const surroundingCells = getSurroundingCells(cell.ship);
          surroundingCells.forEach((item) => {
            const resData = {
              position: { x: item.x, y: item. y },
              currentPlayer: id,
              status: 'miss',
            };
            const cell = this.defender.field![item.x][item.y];
            cell.revealed = true;
            this.gamers.forEach((gamer) => {
              gamer.ws.send(responseHandler('attack', resData));
            });
          });
        }
        this.attacker.shipsLeft -= 1;
        if (this.attacker.shipsLeft === 0) {
          this.gamers.forEach((gamer) => {
            gamer.ws.send(responseHandler('finish', { winPlayer: this.attacker.id }));
          });
          this.attacker.wins += 1;
          updateWinners(this.allPlayers);
          console.log(`User [${this.attacker.name}] is the winner!`);
        } else {
          this.gamers.forEach((gamer) => {
            gamer.ws.send(responseHandler('turn', { currentPlayer: this.attacker.id }));
          });
        }
      }
    }
  }

  randomAttack(id: string) {
    outer: for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = this.defender.field![x][y];
        if (!cell.revealed) {
          this.attack(id, x, y);
          break outer;
        }
      }
    }
  }

  exchangeRoles() {
    const temp = this.defender;
    this.defender = this.attacker;
    this.attacker = temp;
    this.gamers.forEach((gamer) => {
      gamer.ws.send(responseHandler('turn', { currentPlayer: this.attacker.id }));
    });
  }
}