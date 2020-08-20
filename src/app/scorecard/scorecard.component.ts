import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { State } from '../model/State.model';
import { updateNamespaceExportDeclaration } from 'typescript';

@Component({
  selector: 'scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {

  @Input() team: number;
  @Input() state: State;
  color = 'red';
  public teamNames = ['Red Team', 'Yellow Team'];
  public rows = Array.from(new Array<number>(26).keys())
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  ngOnChanges() {
    this.updateCard();
  }

  updateCard() {
    let player = this.state.players[this.team];
    if (player == undefined) { return }
    if (player.turns.length == 0) { this.clearCard() }
    if (player == undefined || player.turns == undefined) { return; }
    for (let i = 0; i < player.turns.length; i++) {
      let elem: Element = <HTMLElement>document.getElementById(`${this.team}-${i}`);
      elem.textContent = player.turns[i].toString();
    }
    // let total: Element = <HTMLElement>document.getElementById(`total-${this.team}`);
    // if (total != null) {
    //   total.textContent = this.sum(this.flatten(player.turns)).toString();
    // }
  }

  clearCard() {
    for (let i of this.rows) {
      let elem: Element = <HTMLElement>document.getElementById(`${this.team}-${i}`);
      if (elem != undefined) { elem.textContent = ''; }
    }
  }

  sum(arr: Array<number>) {
    console.log('arrLen: ' + arr.length);
    let sum: number = 0;
    for (let i = 0; i < arr.length; i++) {
      sum = sum + arr[i];
    }
    console.log(sum);
    return sum;
  }

  flatten(arr) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        res.push(arr[i][j]);
      }
    }
    return res;
  }

}
