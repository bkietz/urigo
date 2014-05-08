{Point, PointSet, Chain, GameState} = require '../bin/state'
{dimensions} = require '../bin/board'
{decodeGameState} = require '../bin/codec'
{renderFile} = require 'jade'
{resolve} = require 'path'



module.exports = -> (req, res, next)->
  # intercept requests for svg:
  getHash = /^\/([^\/]*)\.svg$/g
  getScript = /^\/(js\/[^\/]*(?:\.min)?\.js)$/g
  {path} = req
  if path.length > 97 and getHash.test path
    hash = path.replace getHash,'$1'
    gameState = decodeGameState hash

    locals =
      gameState: gameState
      dimensions: dimensions
      viewport:
        width: dimensions.board.width
        height: dimensions.board.height

    renderFile resolve("#{__dirname}/../views/go-board.jade"), locals, (err, svg)->
      if err?
        console.log 'error rendering go-board.jade: ', err

      res.header
        'Content-Type': 'image/svg+xml'
      res.send svg

  else if getScript.test path
    res.sendfile resolve "#{__dirname}/../browser#{path}"


  else next()


