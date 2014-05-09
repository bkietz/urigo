describe 'truth',->
  it 'should be true',->
    expect(true).to.equal(true)

###
describe 'single stone capture in a corner',->
  it 'should remove the captured stone',->
    dump 'hello'
    g = new GameState()
    g.stateAt Point(1,1),1
    expect(g.stateAt Point 1,1).to.equal(1)
###
