export class Player {
  id: string;
  color: string;
  name: string;
  isCurrPlayer: boolean;
  isSelectingMultiple: boolean;
  turns: Array<Array<number>>;
  score: number

  constructor(id: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.isCurrPlayer = false;
    this.turns = [];
    this.score = 0;
  }

}