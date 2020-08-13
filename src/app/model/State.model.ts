import { Player } from "./Player.model";
import { Tile } from "./Tile.model";

export class State {
  tiles: Tile[][];
  players: Player[];
  gameStarted: boolean;
  message: string;

  constructor() {
    this.tiles = [];
    this.players = [];
    this.gameStarted = false;
    this.message = '';
  }
}