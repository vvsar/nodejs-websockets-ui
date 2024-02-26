import { Room } from "./room";
import { PlayersSet, Ship, Cell, SurroundingCell } from "./types";

export const responseHandler = (type: string, data: unknown) => {
  const dataString = JSON.stringify(data);
  const responseData = {
    type: type,
    data: dataString,
    id: 0,
  };
  return JSON.stringify(responseData);
}

export const findUserByWs = (allPlayers: PlayersSet, ws: WebSocket) => {
  const players = Array.from(allPlayers.values());
  const user = players.find((player) => player.ws === ws);
  return user;
}

export const updateRoom = (rooms: Room[], allPlayers: PlayersSet) => {
  const roomsToUpdate = rooms.filter((room) => room.roomUsers.length === 1);
  const players = Array.from(allPlayers.values());
  players.forEach((player) => {
    player.ws.send(responseHandler('update_room', roomsToUpdate));
  });
}

export const updateWinners = (allPlayers: PlayersSet) => {
  const players = Array.from(allPlayers.values());
  const winners = players
    .filter((player) => player.wins > 0)
    .map((item) => ({ name: item.name, wins: item.wins}));
  players.forEach((player) => {
    player.ws.send(responseHandler('update_winners', winners));
  });
}

export const createField = (ships: Ship[]) => {
  const cells: Cell[][] = []
  for (let x = 0; x < 10; x++) {
    const array: Cell[] = [];
    for (let y = 0; y < 10; y++) {
      array.push({ isEmpty: true, revealed: false });
    }
    cells.push(array);
  }
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const ship = ships.find((item) => {
        return item.position.x === x && item.position.y === y;
      });
      if (ship) {
        ship.hiddenCells = ship.length;
        ship.shotCells = [];
        if (ship.direction) {
          for (let i = y; i < y + ship.length; i++) {
            cells[x][i].isEmpty = false;
            cells[x][i].ship = ship;
          }
        } else {
          for (let i = x; i < x + ship.length; i++) {
            cells[i][y].isEmpty = false;
            cells[i][y].ship = ship;
          }
        }
      }
    }
  }
  return cells;
}

export const getSurroundingCells = (ship: Ship) => {
  const surroundingCells: SurroundingCell[] = [];
  const shipCells: SurroundingCell[] = [];

  if (ship.direction) {
    for (let y = ship.position.y; y < ship.position.y + ship.length; y++) {
      shipCells.push({ x: ship.position.x, y: y });
    }
  } else {
    for (let x = ship.position.x; x < ship.position.x + ship.length; x++) {
      shipCells.push({ x: x, y: ship.position.y });
    }
  }

  if (ship.direction) {
    for (let y = ship.position.y - 1; y <= ship.position.y + ship.length; y++) {
      for (let x = ship.position.x - 1; x <= ship.position.x + 1; x++ ) {
        if (x >=0 && x < 10 && y >= 0 && y < 10) {
          const found = shipCells.find((item) => item.x === x && item.y === y);
          if (!found) {
            surroundingCells.push({ x: x, y: y });
          }
        }
      }
    }
  } else {
    for (let x = ship.position.x - 1; x <= ship.position.x + ship.length; x++) {
      for (let y = ship.position.y - 1; y <= ship.position.y + 1; y++ ) {
        if (x >=0 && x < 10 && y >= 0 && y < 10) {
          const found = shipCells.find((item) => item.x === x && item.y === y);
          if (!found) {
            surroundingCells.push({ x: x, y: y });
          }
        }
      }
    }
  }

  return surroundingCells;
}