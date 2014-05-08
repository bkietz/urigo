(function() {
  var GameState, encodeGameState, gameState, move;

  encodeGameState = require('../bin/codec').encodeGameState;

  GameState = require('../bin/state').GameState;

  gameState = new GameState();

  move = function(index) {
    var point;
    point = gameState.indexToPoint(index);
    if (gameState.whitesTurn) {
      gameState.moveAt(point, 2);
    } else {
      gameState.moveAt(point, 1);
    }
    return window.location.pathname = "/" + (encodeGameState(gameState)) + ".svg";
  };

  document.addEventListener('DOMContentLoaded', function() {
    var href, i, p, pieces, _i, _len, _ref;
    pieces = document.getElementById('pieces');
    gameState.whitesTurn = '1' === pieces.getAttribute('urigo-whites-turn');
    _ref = pieces.childNodes;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      p = _ref[i];
      href = p.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
      gameState.state[i] = (function() {
        switch (href) {
          case '#empty':
            return 0;
          case '#black':
            return 1;
          case '#white':
            return 2;
        }
      })();
    }
    pieces.addEventListener('click', function(e) {
      var index, use;
      if (!(e.target instanceof SVGElementInstance)) {
        return;
      }
      use = e.target.correspondingUseElement;
      index = Array.prototype.indexOf.call(use.parentNode.childNodes, use);
      move(index);
    });
    return pieces.addEventListener('touchstart', function(e) {});
  });

  window.move = move;

  window.gameState = gameState;

}).call(this);
