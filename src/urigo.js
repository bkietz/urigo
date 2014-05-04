// source for browser inclusion

var codec = require('../bin/codec');
var state = require('../bin/state');

var gameState = new state.GameState();

document.addEventListener('DOMContentLoaded', function(){
var pieces = document.getElementById('pieces').childNodes;

for(var p,i=0; p=pieces[i]; ++i) {
  var href = p.getAttributeNS('http://www.w3.org/1999/xlink','href');
  switch(href) {
    case '#empty':
      gameState.state[i] = 0;
      break;
    case '#black':
      gameState.state[i] = 1;
      break;
    case '#white':
      gameState.state[i] = 2;
      break;
  }
}
window.gameState = gameState;



var g = document.getElementById('pieces');
fn = function(e){
  if(e.target instanceof SVGElementInstance) {
     var use = e.target.correspondingUseElement;
     var index = [].indexOf.call(use.parentNode.childNodes, use);
     move(index);
  }
};
g.addEventListener('click', fn)
});

window.move = function(index) {
  gameState.state[index] = 1;
  gameState.whitesTurn = !gameState.whitesTurn;
  window.location.pathname = 
    '/'+codec.encodeGameState(gameState)+'.svg';
}

