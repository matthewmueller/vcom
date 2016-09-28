/**
 * Module Dependencies
 */

let { render } = require('preact')
let { CSS, HTML } = require('..')
let { div, h1, style } = HTML

let css = CSS(`
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
    h1.class('header')(`hi ${name}!`)
  )
)

render(css(App({ name: 'Matt' })), document.body)
