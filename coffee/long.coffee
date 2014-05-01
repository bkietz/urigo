class Long
  constructor:(@digits, @base)->

  toString:(baseString)->
    if baseString?
      (baseString[i] for i in @digits).join ''
    else
      "#{@base}_" + if @base <= 10
        @digits.join ''
      else
        (String.fromCharCode d for d in @digits).join ''

  @fromString:(digitString, baseString)->
    new Long (baseString.indexOf d for d in digitString), baseString.length

  @zero:(base,length)->
    new Long (0 for i in [1..length]),base

  @random:(base,length)->
    new Long (Math.floor base*Math.random() for i in [1..length]),base

  divideBy:(divisor)->
    remainder = 0
    sdiv = (n,d)->[n%d,Math.floor n/d]
    stealOneDigit = (t)->
      return 0 unless t.digits.length
      remainder = remainder*t.base + t.digits.splice(0,1)[0]
      1 + t.digits.length
    quotient = ([remainder] = sdiv remainder,divisor while stealOneDigit @)
    quotient = (e[1] for e in quotient)
    quotient.splice 0,1 until quotient[0] isnt 0
    @digits = quotient
    remainder

  toBase:(newBase)->
    new Long (@divideBy newBase while @digits.length).reverse(), newBase

filenameChars = [
  "0123456789"                 # numeric
  "abcdefghijklmnopqrstuvwxyz" # alpha
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" # ALPHA
  "-_.!~*()"                   # mark 
    # I should get ' as well, but chrome escapes it
  ].join ''   # RFC 2396

decodeGameState = (hash)->
  long = Long.fromString hash, filenameChars
  state = long.toBase(3).digits
  if state.length < 19*19
    state.unshift 0 while state.length isnt 19*19
  else if state.length > 19*19
    state.shift() while state.length isnt 19*19
  state

encodeGameState = (gameState)->
  hash = new Long(gameState.points, 3).toBase filenameChars.length
  # pad with 0 to at least 80 chars
  if hash.digits.length < 80
    hash.digits.unshift 0 while hash.digits.length isnt 80
  hash.toString filenameChars

exports?.decodeGameState = decodeGameState
window?.decodeGameState = decodeGameState
exports?.encodeGameState = encodeGameState
window?.encodeGameState = encodeGameState


