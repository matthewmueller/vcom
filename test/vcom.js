/**
 * Module Dependencies
 */

let assert = require('assert')
let vcom = require('..')

/**
 * Tests
 *
 * - See sun and afro's tests for a more comprehensive suite
 */

describe('vcom', function() {
  it('should ensure that stylesheet is preset', function() {
    assert.ok(vcom.stylesheet)
  })

  it('should check that css is a function', function() {
    let css = vcom.stylesheet(`
      .landing { background: blue; }
    `)

    assert.equal(css(), '._1nxhvta { background: blue; }')
  })

  it('should ensure that the HTML attributes are attached', function() {
    assert.ok(vcom.html.div)
    assert.ok(vcom.html.span)
    assert.ok(vcom.html.h1)
    assert.ok(vcom.html.a)
  })
})
