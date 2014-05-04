# root browser-included script

{encodeGameState} = require '../bin/codec'
{GameState} = require '../bin/state'


gameState = new GameState()

move = (index)->
  gameState.state[index] = 1
  gameState.whitesTurn = !gameState.whitesTurn
  window.location.pathname = "#{encodeGameState gameState}.svg"


document.addEventListener 'DOMContentLoaded', ()->

  pieces = document.getElementById 'pieces'

  for p,i in pieces.childNodes
    href = p.getAttributeNS 'http://www.w3.org/1999/xlink','href'
    gameState.state[i] = switch href
      when '#empty' then 0
      when '#black' then 1
      when '#white' then 2

  pieces.addEventListener 'click', (e)->
    return unless e.target instanceof SVGElementInstance
    use = e.target.correspondingUseElement
    index = Array::indexOf.call use.parentNode.childNodes, use
    move index
    return



# expose these for conveneint browser hacking
window.move = move
window.gameState = gameState
