/**
 * Modules
 */

const { HTML, CSS, render } = require('./dist/vcom.js')

/**
 * Styles
 */

const css = CSS(`
  .box {
    text-align: center;
    font-size: 10rem;
    background: blue;
    padding: 50px;
    color: white;
  }
`)

/**
 * HTML
 */

const { div } = HTML

/**
 * Render
 */

const App = (props) => (
  div.class('box')('welcome')
)

/**
 * Render to DOM
 */

render(css(App), document.body)
