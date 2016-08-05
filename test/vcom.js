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
  it('should ensure that CSS is preset', function() {
    assert.ok(vcom.CSS)
  })

  it('should ensure that the HTML attributes are attached', function() {
    assert.ok(vcom.div)
    assert.ok(vcom.span)
    assert.ok(vcom.h1)
    assert.ok(vcom.a)
  })
})
