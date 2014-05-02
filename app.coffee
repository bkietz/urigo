express = require 'express'
app = express()

urigo = require './bin/express'

app.set 'port', process.env.PORT or 5000
app.set 'view-engine', 'jade'

app.use urigo()
# eliminate this:
app.use '/', express.static "#{__dirname}/static"
# in favor of letting urigo() send urigo.min.js

app.listen app.get('port'), ->
  console.log "Node app is running at localhost: #{app.get 'port'}"
