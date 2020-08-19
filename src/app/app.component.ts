import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import io from "socket.io-client";
import { State } from './model/State.model';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private socket: any;
  public joinForm;
  public joined = false;
  public state: State = new State();
  constructor(private formBuilder: FormBuilder) {
    this.joinForm = this.formBuilder.group({
      name: ''
    })
  }

  ngOnInit() {
    this.socket = io('/game');
    this.setEventListeners();
  }

  setEventListeners() {
    this.socket.on('join-success', state => {
      this.state = state;
      this.joined = true;
    });
    // handle update
    this.socket.on('update', data => {
      console.log('UPDATE');
      console.log(data);
      this.state = data;
    });
  }

  join(name) {
    if (!this.state.gameStarted) {
      console.log('trying to join');
      this.socket.emit('join', name);
    } else {
      console.log('game already started');
    }
  }

  startGame() {
    this.socket.emit('start-game');
  }

  selected(coordinate) {
    this.socket.emit('board-selection', coordinate);
  }

  choseFactors() {
    console.log('trying to chose fact')
    this.socket.emit('chose-factors');
  }
}
