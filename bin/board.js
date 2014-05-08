
/*
  pace [Wikipedia](http://en.wikipedia.org/wiki/Go_equipment)
  (1 shaku = 100 bu = 303 mm)
  Board width              424.2 mm   16 23/32 in   1.4 shaku 尺
  Board length             454.5 mm   17 29/32 in   1.5 shaku 尺
  Board thickness          151.5 mm    5 31/32 in   0.5 shaku 尺
  Line spacing width-wise   22   mm       7/8  in   7.26 bu 分
  Line spacing length-wise  23.7 mm      15/16 in   7.82 bu 分
  Line thickness             1   mm       1/32 in   0.3 bu 分
  Star point marker diameter 4   mm       5/32 in   1.2 bu 分
  Stone diameter            22.5 mm      29/32 in   7.5 bu 分
 */

(function() {
  var dimensions;

  dimensions = {
    stone: {
      radius: 7.5 / 2
    },
    board: {
      height: 140,
      width: 150,
      line: {
        thickness: 0.3,
        spacing: {
          height: 7.26,
          width: 7.82
        }
      },
      star: {
        radius: 1.2 / 2
      }
    }
  };

  dimensions.stone.radius = dimensions.board.line.spacing.height * 0.49;

  dimensions.board.line.offset = {
    height: (dimensions.board.height - 18 * dimensions.board.line.spacing.height) / 2,
    width: (dimensions.board.width - 18 * dimensions.board.line.spacing.width) / 2
  };

  dimensions.coordsToBu = function(x, y) {
    var offset, spacing, _ref;
    _ref = dimensions.board.line, offset = _ref.offset, spacing = _ref.spacing;
    return {
      x: offset.width + x * spacing.width,
      y: offset.height + y * spacing.height
    };
  };

  module.exports.dimensions = dimensions;

}).call(this);
