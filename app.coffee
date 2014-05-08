#!/usr/bin/env coffee

express = require 'express'
app = express()

urigo = require './bin/express'

app.set 'port', process.env.PORT or 5000
app.set 'view-engine', 'jade'

app.use urigo()

app.listen app.get('port'), ->
  console.log "Node app is running at localhost: #{app.get 'port'}"
