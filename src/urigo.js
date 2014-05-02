// source for browser inclusion

var codec = require('../bin/codec');

function move(index){
  gameState.state[index] = 1;
  gameState.whitesTurn = !gameState.whitesTurn;
  window.location.pathname = 
    '/'+codec.encodeGameState(gameState)+'.svg';
}

window.move = move;
