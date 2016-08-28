/**
 * Puttin' it all together
 */

const vcom = require('./index.js')
const { render } = require('preact-render-to-string')

const store = vcom.store({
  boot (state, action) {
    console.log(state, action)
    return action
  },
  todos: {
    create (state, action) {
      return state.concat(action)
    }
  }
})

store('boot', {
  todos: [
    {
      title: 'hi world!'
    }
  ]
})

const { use, send } = vcom.effects()

use(function (before, next) {
  console.log('BEFORE', JSON.stringify(before))
  return next().then(after => {
    console.log('AFTER', JSON.stringify(after))
  })
})

use('state:todo:create', function ({ payload }, next) {
  store('todos:create', payload)
  return next()
})

const {
  button,
  style,
  div,
  h2,
  p,
  component
} = vcom.html

const css = vcom.stylesheet(`
  .App {
    height: 100%
  }

  .header {
    background-color: blue;
  }
  .inner {
    color: red;
    padding: 10px;
  }
  .more {
    color: green;
    padding: 10px;
  }
`)

const App = (props) => {
  let className = props.todos.length % 2 ? 'inner' : 'more'
  return div.class('App')(
    style.type('text/css')(String(css)),
    h2.class('header')('hi there!'),
    button.onClick(onclick)('Click Me!'),
    props.todos.map(todo => p.class(className).style('background: orange;')(todo.title))
  )
}

function onclick (e, send) {
  send({
    type: 'state:todo:create',
    payload: {
      title: 'hi world'
    }
  })
}

console.log(render(App(store())))

if (typeof document !== 'undefined') {
  vcom.render(App, document.body, {
    store: store,
    send: send,
    css: css
  })
}
