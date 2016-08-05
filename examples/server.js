/**
 * Module Dependencies
 */

let render = require('preact-render-to-string')
let { CSS, div, h1, style } = require('..')

let css = CSS(`
  header {
    background: skyblue;
  }

  header:hover {
    background: yellow
  }
`)

const App = ({ name }) => (
  div.class('app')(
    style.type('text/css')(css),
    h1.class(css.header)(`hi ${name}!`)
  )
)

let html = render(App({ name: 'Matt' }))
console.log(html)
