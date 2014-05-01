{Point, PointSet, Chain, GameState} = require 'coffee/go-state'
{dimensions} = require 'coffee/go-board'
{decodeGameState} = require 'coffee/long'

express = require 'express'
app = express()

app.set 'port', process.env.PORT or 5000
app.set 'view-engine', 'jade'

# router = express.Router()

app.use (req, res, next)->
  # intercept requests for svg:
  getHash = /\/([^\/]*)\.svg$/g
  {path} = req
  if path.length > 70 and getHash.test path
    hash = path.replace getHash,'$1'
    state = decodeGameState hash

    locals =
      state: state
      dimensions: dimensions
      viewport:
        width: dimensions.board.width
        height: dimensions.board.height

    res.render 'go-board.jade', locals, (err, svg)->
      res.header
        'Content-Type': 'image/svg+xml'
      res.send svg

  else next()

# app.use '/', router
#app.use
app.use '/', express.static "#{__dirname}/static"


app.listen app.get('port'), ->
  console.log "Node app is running at localhost: #{app.get 'port'}"
