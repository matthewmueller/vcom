/**
 * Module Dependencies
 */

let vcom = require('../index.js')
let assert = require('assert')

/**
 * Tests
 *
 * - See sun and afro's tests for a more comprehensive suite
 */

describe('vcom', function () {
  it('should ensure that stylesheet is preset', function () {
    assert.ok(vcom.Stylesheet)
  })

  it('should check that css is a function', function () {
    let css = vcom.Stylesheet(`
      .landing { background: blue; }
    `)

    assert.equal(css(), '._1nxhvta { background: blue; }')
  })

  it('should ensure that the HTML attributes are attached', function () {
    assert.ok(vcom.HTML.div)
    assert.ok(vcom.HTML.span)
    assert.ok(vcom.HTML.h1)
    assert.ok(vcom.HTML.a)
  })

  describe('CSS', function () {
    it('should support passing a function in', function () {
      let css = vcom.Stylesheet(`
        .theme { color: red; }
        .landing { background: blue; }
      `)

      let a = vcom.HTML.a.class('theme landing')('hi')
      vcom.render(a, document.body, { css })
      let el = document.querySelector('a')
      assert.equal(el.className, '_im3wl1 _1nxhvta')
    })

    it('should support passing an object in', function () {
      let css = vcom.Stylesheet(`
        .theme { color: red; }
        .landing { background: blue; }
      `)

      let obj = {
        landing: css('theme landing')
      }

      let a = vcom.HTML.a.class('landing')('hi')
      vcom.render(a, document.body, { css: obj })
      let el = document.querySelector('a')
      assert.equal(el.className, '_im3wl1 _1nxhvta')
    })
  })

  describe('send', function () {
    it('should pass send in', function (done) {
      let { send, use } = vcom.Effects()

      use(function (payload, next) {
        assert.deepEqual(payload, {
          type: 'hi',
          payload: {}
        })
        return done()
      })

      let button = vcom.html.button.onClick(onClick)('hi')
      vcom.render(button, document.body, { send })
      function onClick (e, send) {
        assert.equal(e.type, 'click')
        send('hi')
      }
      document.querySelector('button').click()
    })
  })
})
