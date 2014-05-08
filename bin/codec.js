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
