{Point, PointSet, Chain, GameState} = require 'coffee/go-state'
{dimensions} = require 'coffee/go-board'
{Long} = require 'coffee/long'

express = require 'express'
app = express()

app.set 'port', process.env.PORT or 5000
app.set 'view-engine', 'jade'

filenameChars = [
  "0123456789"                 # numeric
  "abcdefghijklmnopqrstuvwxyz" # alpha
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" # ALPHA
  "-_.!~*()"                   # mark - I should get ' as well, but chrome escapes it
  ].join ''   # RFC 2396

router = express.Router()

router.use '/', (req, res, next)->
  # intercept requests for svg:
  getHash = /\/([^\/]*)\.svg$/g
  {path} = req
  if path.length > 70 and getHash.test path
    hash = path.replace getHash,'$1'
    long = Long.fromString hash, filenameChars
    state = long.toBase(3).digits
    # normalize the state to 19*19 points
    if state.length < 19*19
      state.unshift 0 while state.length isnt 19*19
    else if state.length > 19*19
      state.shift() while state.length isnt 19*19

    locals =
      state: state
      filenameChars: filenameChars
      dimensions: dimensions
      viewport:
        width: dimensions.board.width
        height: dimensions.board.height

    res.render 'go-board.jade', locals, (err, svg)->
      res.header
        'Content-Type': 'image/svg+xml'
      res.send svg

  else next()


router.use express.static "#{__dirname}/static"

app.use '/', router

app.listen app.get('port'), ->
  console.log "Node app is running at localhost: #{app.get 'port'}"
