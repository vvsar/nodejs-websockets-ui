import { PlayersSet } from "./types";

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