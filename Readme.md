
# vcom

  Everything you need to create functional, virtual [Preact](https://github.com/developit/preact) Components with CSS, HTML, and JS.

  > Note: if you want to use this standalone, please use dist/vcom.js. Otherwise you'll want to use babel with es2015 or buble to transpile this in your application, either as a global transform or after the build step.

## Example

```js
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
```

## Installation

```bash
npm install vcom
```

## License

MIT
