{GameState} = require '../bin/state'

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
    rebased = new Long (@divideBy newBase while @digits.length).reverse(), newBase
    @digits = rebased.digits; @base = rebased.base
    this




###

Go Codec
========

As of version 0 of this codec, I use 96 filename
characters to encode the state of a game.

According to RFC 2396:
###
filenameChars = "0123456789"+
                "abcdefghijklmnopqrstuvwxyz"+
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                "-_.!~*()"
###
(I should get ' as well, but browsers escape it)

The first character is a version number. (TODO)
The rest should be shifted to base 3.
###
ternaryLength  = 19*19 + 6
filenameLength = 1+Math.ceil ternaryLength * Math.log(3)/Math.log(filenameChars.length)
###
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

###


pad0 = (array, length)->
  array.unshift 0 while array.length isnt length

decodeGameState = (hash)->
  versionChar = hash[0]
  if versionChar isnt '0'
    throw new RangeError 'Still in alpha, bro.'

  ternary = Long.fromString(hash[1..], filenameChars).toBase 3
  pad0 ternary.digits, ternaryLength
  binary = new Long(ternary.digits.splice(19*19), 3).toBase 2
  new GameState ternary.digits[..19*19-1], binary.digits[0]

encodeGameState = (gameState)->
  ternary = new Long gameState.state.concat([0+gameState.whitesTurn,0,0,0,0,0]), 3
  hash = ternary.toBase filenameChars.length
  pad0 hash.digits, filenameLength - 1
  '0' + hash.toString filenameChars




module.exports =
  decodeGameState: decodeGameState
  encodeGameState: encodeGameState
  pad0: pad0
