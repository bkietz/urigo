class Point
  constructor:(x,y)->
    return new Point arguments... unless this instanceof Point
    @x=x; @y=y

  equalTo:(other)-> @x is other.x and @y is other.y

  neighbors:-> new PointSet [
    Point @x,@y-1
    Point @x,@y+1
    Point @x-1,@y
    Point @x+1,@y
  ]




class PointSet
  constructor:(arrayOfAddable=[])->
    @points = []
    @add a for a in arrayOfAddable

  contains:(point)->
    # @points.every (p)-> p.equalTo point
    for p in @points
      return true if p.equalTo point
    false

  add:(x,y)->
    if x instanceof Point
      @points.push x unless @contains x
    if x instanceof PointSet
      @add p for p in x.points
    if typeof x is typeof y is 'number'
      @add Point x,y
    this

  remove:(x,y)->
    if x instanceof Point
      @points = @points.filter (p)-> not p.equalTo x
    if x instanceof PointSet
      @remove p for p in x.points
    if typeof x is typeof y is 'number'
      @remove Point x,y
    this

  at:(n)->if n<0 then @points[@size()+n] else @points[n]

  size:->@points.length

  map:(fn)->new PointSet(fn point for point in @points)




class Chain extends PointSet
  constructor:(@gameState, start, original=this)->
    return new Chain arguments... unless this instanceof Chain
    super start
    start.neighbors().map (neighbor)->
      return unless gameState.stateAt(start) is gameState.stateAt(neighbor)
      return if original.contains neighbor
      original.add neighbor
      original.add Chain gameState, neighbor, original

  hasLiberty:->
    hasLiberty = false
    @map (groupie)=>
      groupie.neighbors().map (n)=>
         hasLiberty ||= not @gameState.stateAt n
    hasLiberty




class GameState
  constructor:(@state = 0 for i in [1..19*19])->

  validPoint:(point)->
    point.x>=0 and point.x<19 and point.y>=0 and point.y<19

  pointToIndex:(point)->
    point.x + 19*point.y
    
  indexToPoint:(index)->
    Point index%19, Math.floor index/19

  toString:->
    str = ''
    for state,index in @state
      str += if index%19 then ' ' else '\n'
      str += switch state
        when 0 then '+'
        when 1 then '\u25cf'
        when 2 then '\u25cc'
    str

  stateAt:(location, newState)->
    if location instanceof Point
      return unless @validPoint location
      index = @pointToIndex location
      if newState?
        @state[index] = newState
      else
        @state[index] unless newState?
    else if location instanceof PointSet
      @stateAt p,newState for p in location.points

  moveAt:(point, newState)->
    return if @stateAt point
    @stateAt point, newState
    point.neighbors().map (n)=>
      state = @stateAt n
      if state and state isnt newState
        chain = Chain this, n
        @stateAt chain, 0 unless chain.hasLiberty()


module.exports =
  Point:    Point
  PointSet: PointSet
  Chain:    Chain
  GameState:GameState
