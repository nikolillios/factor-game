export class Player {
  id: string;
  color: string;
  name: string;
  isCurrPlayer: boolean;

  constructor(id: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.isCurrPlayer = false;
  }

}