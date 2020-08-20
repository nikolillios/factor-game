const express = require('express');
const app = express();
const path = require('path');
const { setMaxListeners } = require('process');
const { get } = require('http');
const { stat } = require('fs');
const { start } = require('repl');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/dist/factor-game'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/factor-game/index.html'));
})

server.listen(process.env.PORT || 4200, () => {
  console.log('listening');
})

let game = io.of('/game')

var state = {
  tiles: initTiles(),
  players: [],
  gameStarted: false,
  message: '',
  turn: 0
}

function initTiles() {
  let res = [];
  for (let i = 2; i < 65; i++) {
    if (i % 7 == 2) {
      res.push([]);
    }
    res[res.length - 1].push(tile(i));
  }
  return res;
}

function tile(value) {
  return { value: value, color: 'transparent', marked: false };
}

game.on('connection', socket => {
  socket.emit('update', state);
  setListeners(socket);
})

function setListeners(socket) {
  //player join
  socket.on('join', (data) => {
    if (getPlayerWithId(socket.id) == null && !state.gameStarted) {
      // register new connection
      state.players.push({
        id: socket.id,
        name: data.name,
        color: getColor(),
        isCurrPlayer: false,
        isSelectingMultiple: false,
        turns: []
      });
      socket.emit('join-success', state);
      game.emit('update', state);
      state.message = 'You have connected';
    } else {
      game.emit('msg', 'error: you can not join');
    }
  });
  //start game
  socket.on('start-game', data => {
    startGame();
  });
  socket.on('play-again', () => {
    if (state.gameStarted) { return; }
    console.log('players: ' + JSON.stringify(resetPlayers(state.players)))
    console.log('tiles: ' + JSON.stringify(initTiles()))
    let newState = {
      tiles: initTiles(),
      players: resetPlayers(state.players),
      gameStarted: true,
      message: '',
      turn: 0
    };
    state = newState;
    startGame();
    game.emit('update', state);
  });
  //board-selection
  socket.on('board-selection', coordinate => {
    let tile = state.tiles[coordinate.row][coordinate.column];
    let curr = currPlayer();
    if (isCurrPlayer(socket.id) && !tile.marked) {
      if (curr.isSelectingMultiple) {
        curr.turns.push([]);
        curr.turns[state.turn].push(tile.value);
        tile.marked = true; // mark tile
        setNextCurrPlayer(getPlayerWithId(socket.id));
        currPlayer().isSelectingMultiple = false;
        currPlayer().turns.push([]);
        tile.color = getPlayerWithId(socket.id).color;
      } else if (isProperFactor(tile.value)) {
        curr.turns[state.turn].push(tile.value);
        tile.marked = true; // mark tile
        tile.color = getPlayerWithId(socket.id).color;
      }
    } else {
      socket.emit('message', "error with board selection");
    }
    game.emit('update', state);
  });
  //chose-factors
  socket.on('chose-factors', () => {
    if (isCurrPlayer(socket.id) && !currPlayer().isSelectingMultiple) {
      currPlayer().isSelectingMultiple = true;
      state.turn++;
      socket.emit('update', state);
    }
  })
  // handle socket disconnect 
  socket.on('disconnect', () => {
    console.log('disconnecting');
    let player = getPlayerWithId(socket.id);
    let index = state.players.indexOf(player);
    state.players.splice(index, 1);
    if (state.players.length == 0) {
      state.initTiles = initTiles();
      state.gameStarted = false;
      state.message = '';
    }
    game.emit('update', state);
  });
}

function startGame() {
  if (state.players.length <= 1) { return; }
  let player = state.players[0];
  player.isCurrPlayer = true;
  player.isSelectingMultiple = true;
  state.gameStarted = true;
  game.emit('update', state);
}

function resetPlayers(players) {
  for (let i = 0; i < players.length; i++) {
    let player = players[i];
    player.turns = [];
    player.isCurrPlayer = false;
    player.isSelectingMultiple = false;
  }
  return players
}

function isProperFactor(value) {
  if (value == 1) { return }
  let lastPlayer;
  for (let i = 0; i < state.players.length; i++) {
    if (!state.players[i].isCurrPlayer) {
      lastPlayer = state.players[i];
    }
  }
  let multiple = lastPlayer.turns[state.turn][0];
  return (multiple % value == 0);
}

function getPlayerWithId(id) {
  for (let i = 0; i < state.players.length; i++) {
    if (state.players[i].id == id) {
      return state.players[i];
    }
  }
  return undefined;
}

function currPlayer() {
  for (let i = 0; i < state.players.length; i++) {
    if (state.players[i].isCurrPlayer) {
      return state.players[i];
    }
  }
  return undefined;
}

function isCurrPlayer(id) {
  return getPlayerWithId(id) ? getPlayerWithId(id).isCurrPlayer : false;
}

function setNextCurrPlayer(currPlayer) {
  let players = state.players;
  let currIndex = players.indexOf(currPlayer);
  let nextIndex = (currIndex + 1) % players.length;
  players[currIndex].isCurrPlayer = false;
  players[nextIndex].isCurrPlayer = true;
}

let colors = ['red', 'yellow'];
let colorInd = -1;
function getColor() {
  colorInd++;
  return colors[colorInd % 4];
}