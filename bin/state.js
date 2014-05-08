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
