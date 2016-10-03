/**
 * Module Dependencies
 */

let { CSS, HTML, render, Effects } = require('..')
let { div, h1, style } = HTML
let effects = Effects()

let css = CSS(`
  .header {
    background: skyblue;
  }

  .header:hover {
    background: yellow
  }
`)

var i = 5
const App = ({ name }) => (
  div.class('app')(
    style.type('text/css')(css()),
    (i > 0 || i < -5) && h1({ onMount: mount, onUnmount: unmount }).class('header')(`hi ${name}!`)
  )
)

setInterval(function () {
  i--
  render(css(App({ name: 'Matt' })), document.body, {
    root: document.body.lastChild,
    effects
  })
}, 500)

function mount (el, send) {
  console.log('mounting!')
}

function unmount (el, send) {
  console.log('unmounting!')
}
