import { formatDiagnosticsWithColorAndContext } from "typescript";

export class Tile {
  value: number;
  color: string;
  marked: boolean;

  constructor(value, color) {
    this.value = value;
    this.color = color;
    this.marked = false;
  }
}