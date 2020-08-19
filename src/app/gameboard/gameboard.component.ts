import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import io from "socket.io-client"
import { State } from "../model/State.model"

@Component({
  selector: 'gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.css']
})
export class GameboardComponent implements OnInit {

  @Output() selected = new EventEmitter<any>();
  @Input() state: State = new State();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  getPlayerWithId(id) {
    for (let i = 0; i < this.state.players.length; i++) {
      if (this.state.players[i].id == id) {
        return this.state.players[i];
      }
    }
    throw new Error('no such player');
  }

  registerClick(row: number, column: number) {
    this.selected.emit({ row: row, column: column });
  }


  rows() {
    return this.state ? Array.from(this.state.tiles.keys()) : []
  }

  columns() {
    return this.state ? Array.from(this.state.tiles[0].keys()) : []
  }

}
