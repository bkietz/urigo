(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var GameState, Long, decodeGameState, encodeGameState, filenameChars, filenameLength, pad0, ternaryLength;

  GameState = require('../bin/state').GameState;

  Long = (function() {
    function Long(digits, base) {
      this.digits = digits;
      this.base = base;
    }

    Long.prototype.toString = function(baseString) {
      var d, i;
      if (baseString != null) {
        return ((function() {
          var _i, _len, _ref, _results;
          _ref = this.digits;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(baseString[i]);
          }
          return _results;
        }).call(this)).join('');
      } else {
        return ("" + this.base + "_") + (this.base <= 10 ? this.digits.join('') : ((function() {
          var _i, _len, _ref, _results;
          _ref = this.digits;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            d = _ref[_i];
            _results.push(String.fromCharCode(d));
          }
          return _results;
        }).call(this)).join(''));
      }
    };

    Long.fromString = function(digitString, baseString) {
      var d;
      return new Long((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = digitString.length; _i < _len; _i++) {
          d = digitString[_i];
          _results.push(baseString.indexOf(d));
        }
        return _results;
      })(), baseString.length);
    };

    Long.zero = function(base, length) {
      var i;
      return new Long((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; 1 <= length ? _i <= length : _i >= length; i = 1 <= length ? ++_i : --_i) {
          _results.push(0);
        }
        return _results;
      })(), base);
    };

    Long.random = function(base, length) {
      var i;
      return new Long((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; 1 <= length ? _i <= length : _i >= length; i = 1 <= length ? ++_i : --_i) {
          _results.push(Math.floor(base * Math.random()));
        }
        return _results;
      })(), base);
    };

    Long.prototype.divideBy = function(divisor) {
      var e, quotient, remainder, sdiv, stealOneDigit;
      remainder = 0;
      sdiv = function(n, d) {
        return [n % d, Math.floor(n / d)];
      };
      stealOneDigit = function(t) {
        if (!t.digits.length) {
          return 0;
        }
        remainder = remainder * t.base + t.digits.splice(0, 1)[0];
        return 1 + t.digits.length;
      };
      quotient = ((function() {
        var _ref, _results;
        _results = [];
        while (stealOneDigit(this)) {
          _results.push((_ref = sdiv(remainder, divisor), remainder = _ref[0], _ref));
        }
        return _results;
      }).call(this));
      quotient = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = quotient.length; _i < _len; _i++) {
          e = quotient[_i];
          _results.push(e[1]);
        }
        return _results;
      })();
      while (quotient[0] === 0) {
        quotient.splice(0, 1);
      }
      this.digits = quotient;
      return remainder;
    };

    Long.prototype.toBase = function(newBase) {
      var rebased;
      rebased = new Long(((function() {
        var _results;
        _results = [];
        while (this.digits.length) {
          _results.push(this.divideBy(newBase));
        }
        return _results;
      }).call(this)).reverse(), newBase);
      this.digits = rebased.digits;
      this.base = rebased.base;
      return this;
    };

    return Long;

  })();


  /*
  
  Go Codec
  ========
  
  As of version 0 of this codec, I use 97 filename
  characters to encode the state of a game.
  
  According to RFC 2396:
   */

  filenameChars = "0123456789" + "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "-_.!~*";


  /*
  (I should get `'` as well, but browsers escape it)
  (I should get `()` as well, but 
   [twitter is too clever](https://github.com/twitter/twitter-text-js/blob/master/twitter-text.js#L265))
  
  The first character is a version number. (TODO)
  The rest should be shifted to base 3.
   */

  ternaryLength = 19 * 19 + 6;

  filenameLength = 1 + Math.ceil(ternaryLength * Math.log(3) / Math.log(filenameChars.length));


  /*
  The first 361 ternary digits express the occupation
  of points on the board:
  
  - 0 stands for an empty point
  - 1 stands for a point with a black stone
  - 2 stands for a point with a white stone
  
  The final 6 ternary digits express turn and koh, and 
  should be shifted again to base 2. The lowest bit
  is 1 if it is black's turn and 0 if it is white's.
  The rest of the bits are the index of the point
  of koh. (for example `10110100 == decimal 180`
  would be koh at the exact center.) Values
  where the bits are `101101001 == decimal 361` or 
  greater (off the board) are given special meaning:
  
     361: no koh this turn
     362: last turn was passed
   */

  pad0 = function(array, length) {
    var _results;
    _results = [];
    while (array.length !== length) {
      _results.push(array.unshift(0));
    }
    return _results;
  };

  decodeGameState = function(hash) {
    var binary, ternary, versionChar;
    versionChar = hash[0];
    if (versionChar !== '0') {
      throw new RangeError('Still in alpha, bro.');
    }
    ternary = Long.fromString(hash.slice(1), filenameChars).toBase(3);
    pad0(ternary.digits, ternaryLength);
    binary = new Long(ternary.digits.splice(19 * 19), 3).toBase(2);
    return new GameState(ternary.digits.slice(0, +(19 * 19 - 1) + 1 || 9e9), binary.digits[0]);
  };

  encodeGameState = function(gameState) {
    var hash, ternary;
    ternary = new Long(gameState.state.concat([0 + gameState.whitesTurn, 0, 0, 0, 0, 0]), 3);
    hash = ternary.toBase(filenameChars.length);
    pad0(hash.digits, filenameLength - 1);
    return '0' + hash.toString(filenameChars);
  };

  module.exports = {
    decodeGameState: decodeGameState,
    encodeGameState: encodeGameState
  };

}).call(this);

},{"../bin/state":2}],2:[function(require,module,exports){
(function() {
  var Chain, GameState, Point, PointSet,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Point = (function() {
    function Point(x, y) {
      if (!(this instanceof Point)) {
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Point, arguments, function(){});
      }
      this.x = x;
      this.y = y;
    }

    Point.prototype.equalTo = function(other) {
      return this.x === other.x && this.y === other.y;
    };

    Point.prototype.neighbors = function() {
      return new PointSet([Point(this.x, this.y - 1), Point(this.x, this.y + 1), Point(this.x - 1, this.y), Point(this.x + 1, this.y)]);
    };

    return Point;

  })();

  PointSet = (function() {
    function PointSet(arrayOfAddable) {
      var a, _i, _len;
      if (arrayOfAddable == null) {
        arrayOfAddable = [];
      }
      this.points = [];
      for (_i = 0, _len = arrayOfAddable.length; _i < _len; _i++) {
        a = arrayOfAddable[_i];
        this.add(a);
      }
    }

    PointSet.prototype.contains = function(point) {
      var p, _i, _len, _ref;
      _ref = this.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (p.equalTo(point)) {
          return true;
        }
      }
      return false;
    };

    PointSet.prototype.add = function(x, y) {
      var p, _i, _len, _ref, _ref1;
      if (x instanceof Point) {
        if (!this.contains(x)) {
          this.points.push(x);
        }
      }
      if (x instanceof PointSet) {
        _ref = x.points;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          this.add(p);
        }
      }
      if ((typeof x === (_ref1 = typeof y) && _ref1 === 'number')) {
        this.add(Point(x, y));
      }
      return this;
    };

    PointSet.prototype.remove = function(x, y) {
      var p, _i, _len, _ref, _ref1;
      if (x instanceof Point) {
        this.points = this.points.filter(function(p) {
          return !p.equalTo(x);
        });
      }
      if (x instanceof PointSet) {
        _ref = x.points;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          this.remove(p);
        }
      }
      if ((typeof x === (_ref1 = typeof y) && _ref1 === 'number')) {
        this.remove(Point(x, y));
      }
      return this;
    };

    PointSet.prototype.at = function(n) {
      if (n < 0) {
        return this.points[this.size() + n];
      } else {
        return this.points[n];
      }
    };

    PointSet.prototype.size = function() {
      return this.points.length;
    };

    PointSet.prototype.map = function(fn) {
      var point;
      return new PointSet((function() {
        var _i, _len, _ref, _results;
        _ref = this.points;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          point = _ref[_i];
          _results.push(fn(point));
        }
        return _results;
      }).call(this));
    };

    return PointSet;

  })();

  Chain = (function(_super) {
    __extends(Chain, _super);

    function Chain(gameState, start, original) {
      this.gameState = gameState;
      if (original == null) {
        original = this;
      }
      if (!(this instanceof Chain)) {
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Chain, arguments, function(){});
      }
      Chain.__super__.constructor.call(this, [start]);
      start.neighbors().map(function(neighbor) {
        if (gameState.stateAt(start) !== gameState.stateAt(neighbor)) {
          return;
        }
        if (original.contains(neighbor)) {
          return;
        }
        original.add(neighbor);
        return original.add(Chain(gameState, neighbor, original));
      });
    }

    Chain.prototype.hasLiberty = function() {
      var hasLiberty;
      hasLiberty = false;
      this.map((function(_this) {
        return function(groupie) {
          return groupie.neighbors().map(function(n) {
            if (_this.gameState.validPoint(n)) {
              return hasLiberty || (hasLiberty = !_this.gameState.stateAt(n));
            }
          });
        };
      })(this));
      return hasLiberty;
    };

    return Chain;

  })(PointSet);

  GameState = (function() {
    function GameState(state, whitesTurn) {
      var i;
      this.state = (function() {
        var _i, _ref, _results;
        if (state != null) {
          return state;
        } else {
          _results = [];
          for (i = _i = 1, _ref = 19 * 19; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
            _results.push(0);
          }
          return _results;
        }
      })();
      this.whitesTurn = whitesTurn != null ? whitesTurn : false;
    }

    GameState.prototype.validPoint = function(point) {
      return point.x >= 0 && point.x < 19 && point.y >= 0 && point.y < 19;
    };

    GameState.prototype.pointToIndex = function(point) {
      return point.x + 19 * point.y;
    };

    GameState.prototype.indexToPoint = function(index) {
      return Point(index % 19, Math.floor(index / 19));
    };

    GameState.prototype.toString = function() {
      var index, state, str, _i, _len, _ref;
      str = '';
      _ref = this.state;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        state = _ref[index];
        str += index % 19 ? ' ' : '\n';
        str += (function() {
          switch (state) {
            case 0:
              return '+';
            case 1:
              return '\u25cf';
            case 2:
              return '\u25cc';
          }
        })();
      }
      return str;
    };

    GameState.prototype.stateAt = function(location, newState) {
      var index, p, _i, _len, _ref, _results;
      if (location instanceof Point) {
        if (!this.validPoint(location)) {
          return;
        }
        index = this.pointToIndex(location);
        if (newState != null) {
          return this.state[index] = newState;
        } else {
          if (newState == null) {
            return this.state[index];
          }
        }
      } else if (location instanceof PointSet) {
        _ref = location.points;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          _results.push(this.stateAt(p, newState));
        }
        return _results;
      }
    };

    GameState.prototype.moveAt = function(point, newState) {
      if (this.stateAt(point)) {
        return;
      }
      this.whitesTurn = !this.whitesTurn;
      this.stateAt(point, newState);
      return point.neighbors().map((function(_this) {
        return function(n) {
          var chain, state;
          state = _this.stateAt(n);
          if (state && state !== newState) {
            chain = Chain(_this, n);
            if (!chain.hasLiberty()) {
              return _this.stateAt(chain, 0);
            }
          }
        };
      })(this));
    };

    return GameState;

  })();

  module.exports = {
    Point: Point,
    PointSet: PointSet,
    Chain: Chain,
    GameState: GameState
  };

}).call(this);

},{}],3:[function(require,module,exports){
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

},{"../bin/codec":1,"../bin/state":2}]},{},[3])