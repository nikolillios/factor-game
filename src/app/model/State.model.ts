import { Player } from "./Player.model";
import { Tile } from "./Tile.model";

export class State {
  tiles: Tile[][];
  players: Player[];
  gameStarted: boolean;
  message: string;
  turn: number;
  score: [number, number]

  constructor() {
    this.tiles = [];
    this.players = [];
    this.gameStarted = false;
    this.message = '';
    this.turn = 0;
    this.score = [0, 0];
  }
}