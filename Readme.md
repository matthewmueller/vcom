
# vcom

  Everything you need to create virtual [Preact](https://github.com/developit/preact) components with CSS, HTML, and JS.

## Example

```js
let { CSS, div, h1, style } = require('vcom')
let { render } = require('preact')

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

render(App({ name: 'Matt' }), document.body)
```

## License

MIT
