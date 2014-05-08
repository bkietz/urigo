(function() {
  var Chain, GameState, Point, PointSet, decodeGameState, dimensions, renderFile, _ref;

  _ref = require('../bin/state'), Point = _ref.Point, PointSet = _ref.PointSet, Chain = _ref.Chain, GameState = _ref.GameState;

  dimensions = require('../bin/board').dimensions;

  decodeGameState = require('../bin/codec').decodeGameState;

  renderFile = require('jade').renderFile;

  module.exports = function() {
    return function(req, res, next) {
      var gameState, getHash, getScript, hash, locals, path;
      getHash = /^\/([^\/]*)\.svg$/g;
      getScript = /^\/(js\/[^\/]*(?:\.min)?\.js)$/g;
      path = req.path;
      if (path.length > 70 && getHash.test(path)) {
        hash = path.replace(getHash, '$1');
        gameState = decodeGameState(hash);
        locals = {
          gameState: gameState,
          dimensions: dimensions,
          viewport: {
            width: dimensions.board.width,
            height: dimensions.board.height
          }
        };
        return renderFile('views/go-board.jade', locals, function(err, svg) {
          if (err != null) {
            console.log('error rendering go-board.jade: ', err);
          }
          res.header({
            'Content-Type': 'image/svg+xml'
          });
          return res.send(svg);
        });
      } else if (getScript.test(path)) {
        return res.sendfile("browser" + path);
      } else {
        return next();
      }
    };
  };

}).call(this);
