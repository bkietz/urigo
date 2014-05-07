# root browser-included script

{encodeGameState} = require '../bin/codec'
{GameState} = require '../bin/state'


gameState = new GameState()

move = (index)->
  point = gameState.indexToPoint index
  if gameState.whitesTurn
    gameState.moveAt point,2
  else
    gameState.moveAt point,1
  window.location.pathname = "/#{encodeGameState gameState}.svg"


document.addEventListener 'DOMContentLoaded', ()->

  pieces = document.getElementById 'pieces'

  # turn is stored in an attribute
  gameState.whitesTurn = '1' is pieces.getAttribute 'urigo-whites-turn'

  # stone positions are stored in the SVG:
  for p,i in pieces.childNodes
    href = p.getAttributeNS 'http://www.w3.org/1999/xlink','href'
    gameState.state[i] = switch href
      when '#empty' then 0
      when '#black' then 1
      when '#white' then 2

  # click listener to move at a location:
  pieces.addEventListener 'click', (e)->
    return unless e.target instanceof SVGElementInstance
    use = e.target.correspondingUseElement
    index = Array::indexOf.call use.parentNode.childNodes, use
    move index
    return

  # touch listener to examine interaction with click:
  pieces.addEventListener 'touch', (e)->
    e.preventDefault()
    e.stopPropagation()
    return



# expose these for conveneint browser hacking
window.move = move
window.gameState = gameState
