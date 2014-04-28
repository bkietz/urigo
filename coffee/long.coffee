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

exports?.Long = Long
window?.Long = Long
@Long = Long
