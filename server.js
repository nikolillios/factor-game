const express = require('express');
const app = express();
const path = require('path');
const { setMaxListeners } = require('process');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/dist/factor-game'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirnam + '/dist/factor-game/index.html'));
})

server.listen(process.env.PORT || 4200, () => {
  console.log('listening');
})

let game = io.of('/game')

var state = {
  tiles: initTiles(),
  players: [],
  gameStarted: false,
  message: ''
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
  return { value: value, color: 'none', marked: false };
}

game.on('connection', socket => {
  setListeners(socket);
})

function setListeners(socket) {

  socket.on('join', (data) => {
    if (getPlayerWithId(socket.id) == null && !state.gameStarted) {
      // register new connection
      state.players.push({
        id: socket.id,
        name: data.name,
        color: getColor(),
        isCurrPlayer: false,
      });
      socket.emit('join-success', state);
      game.emit('update', state);
      state.message = 'You have connected';
    } else {
      game.emit('msg', 'error: you can not join');
    }
  });
  // handle socket disconnect 
  socket.on('disconnect', () => {
    console.log('disconnecting');
    let player = getPlayerWithId(socket.id);
    let index = state.players.indexOf(player);
    state.players.splice(index, 1);
    game.emit('update', state);
  });
}

function getPlayerWithId(id) {
  for (let i = 0; i < state.players.length; i++) {
    if (state.players[i].id == id) {
      return state.players[i];
    }
  }
  return null;
}

let colors = ['lightblue', 'lightgreen', 'red', 'orange'];
let colorInd = 0;
function getColor() {
  colorInd++;
  return colors[colorInd % 4];
}