/**
 * Module Dependencies
 */

let string = require('preact-render-to-string')
let { CSS, HTML, render } = require('..')

let css = CSS(`
  .header {
    background: skyblue;
  }

  .header:hover {
    background: yellow
  }
`)

const { div, style, h1 } = HTML

const App = ({ name }) => (
  div.class('app')(
    style.type('text/css')(css()),
    h1.class('header').onClick(hi)(`hi ${name}!`)
  )
)

function hi () {
  console.log('hi!')
}

console.log(string(css(App({ name: 'Matt' }))))
document.body.innerHTML = string(css(App({ name: 'matt' })))

render(css(App({ name: 'Matt' })), document.body, {
  root: document.body.lastChild
})
