/**
 * Module Dependencies
 */

const vcom = require('../index.js')
const assert = require('assert')
const { h } = require('preact')

/**
 * Tests
 *
 * - See sun and afro's tests for a more comprehensive suite
 */

describe('vcom', function () {
  it('should ensure that stylesheet is preset', function () {
    assert.ok(vcom.CSS)
  })

  it('should check stylesheet is afro', function () {
    let css = vcom.Stylesheet(`
      .landing { background: blue; }
    `)

    assert.equal(css(), '._1nxhvta { background: blue; }')
  })

  describe('HTML', () => {
    it('should ensure that the HTML attributes are attached', function () {
      assert.ok(vcom.HTML.div)
      assert.ok(vcom.HTML.span)
      assert.ok(vcom.HTML.h1)
      assert.ok(vcom.HTML.a)
    })

    it('should work vnode children', () => {
      let d = vcom.HTML.div([
        h('h2', { class: 'blue' }, [
          h('strong', {}, [
            'hi there!'
          ])
        ])
      ])
      assert.equal(r(d), '<div><h2 class="blue"><strong>hi there!</strong></h2></div>')
    })
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

    it('should support rewriting render functions', function () {
      let css = vcom.CSS(`
        .theme { color: red; }
        .landing { background: blue; }
      `)

      function render (props) {
        return vcom.HTML.a.class('theme landing')('hi')
      }

      vcom.render(css(render), document.body)
      let el = document.querySelector('a')
      assert.equal(el.className, '_im3wl1 _1nxhvta')
    })

    it('should support passing direct vnodes in', () => {
      let css = vcom.CSS(`
        .theme { color: red; }
        .landing { background: blue; }
      `)

      function render (props) {
        return vcom.HTML.a.class('theme landing')('hi')
      }

      vcom.render(css(render({})), document.body)
      let el = document.querySelector('a')
      assert.equal(el.className, '_im3wl1 _1nxhvta')
    })

    it('should write out CSS when there are no arguments', () => {
      let css = vcom.CSS(`
        .theme { color: red; }
        .landing { background: blue; }
      `)

      assert.equal(css(), `._im3wl1 { color: red; }
._1nxhvta { background: blue; }`)
    })
  })

  describe('send', function () {
    it('should pass send in', function (done) {
      let { send, on } = vcom.Effects()

      on(function (payload, next) {
        assert.deepEqual(payload, {
          type: 'hi',
          payload: null
        })
        return done()
      })

      let button = vcom.HTML.button.onClick(onClick)('hi')
      vcom.render(button, document.body, { effects: { send } })
      function onClick (e, send) {
        assert.equal(e.type, 'click')
        send('hi')
      }
      document.querySelector('button').click()
    })
  })

  describe('server-side rendering', () => {
    it('should render both as as string and to dom', (done) => {
      const string = require('preact-render-to-string')
      const { CSS, HTML, render } = require('..')
      const { div, style, button } = HTML

      const css = CSS(`
        .header {
          background: skyblue;
        }

        .header:hover {
          background: yellow
        }
      `)

      const App = ({ name }) => (
        div.class('app')(
          style.type('text/css')(css()),
          button.class('header').onClick(e => done())(`hi ${name}!`)
        )
      )

      const html = string(css(App({ name: 'Matt' })))
      document.body.innerHTML = html

      assert.equal(document.body.innerHTML, `<div class="app"><style type="text/css">._i2392t { background: skyblue; }
._i2392t:hover { background: yellow; }</style><button class="_i2392t">hi Matt!</button></div>`)

      render(css(App({ name: 'Mark' })), document.body, {
        root: document.body.lastChild
      })

      assert.equal(document.body.innerHTML, `<div class="app"><style type="text/css">._i2392t { background: skyblue; }
._i2392t:hover { background: yellow; }</style><button class="_i2392t">hi Mark!</button></div>`)

      document.querySelector('button').click()
    })
  })
})

function r (v) {
  document.body.innerHTML = ''
  vcom.render(v, document.body)
  return document.body.innerHTML
}
