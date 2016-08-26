const preact = require('preact')
// const { render } = require('preact-render-to-string')
const Socrates = require('socrates')
const Alley = require('alley')
const afro = require('afro')
const u = require('updeep')

let resolved = typeof Promise!=='undefined' && Promise.resolve();
const defer = resolved ? (f => { resolved.then(f); }) : setTimeout;

const store = Socrates({
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
  todos: []
})

const alley = Alley()

alley('state').use(storage({ todos: [] }))

function storage (initial) {
  return function (action, next) {
    return next(action)
  }
}

alley('state:todo:create').use(function ({ payload }, next) {
  store('create todos', payload)
  return next()
})

const Events = [
  'onCopy', 'onCut', 'onPaste',
  'onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate',
  'onKeyDown', 'onKeyPress', 'onKeyUp',
  'onFocus', 'onBlur',
  'onChange', 'onInput', 'onSubmit',
  'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit',
  'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave',
  'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp',
  'onSelect',
  'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart',
  'onScroll',
  'onWheel',
  'onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted',
  'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay',
  'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend',
  'onTimeUpdate', 'onVolumeChange', 'onWaiting',
  'onLoad',
  'onAnimationStart', 'onAnimationEnd', 'onAnimationIteration',
  'onTransitionEnd'
]

const {
  button,
  style,
  div,
  h2,
  p,
  component
} = require('sun')

const css = afro(`
  .App {
    height: 100%
  }

  .header {
    background-color: blue;
  }
  .inner {
    color: red;
  }
  .more {
    color: green !important;
  }
`)

const App = (props) => {
  let className = props.todos.length % 2 ? 'inner' : 'more'
  return Page.class('App')({ css, send: alley.send })(
    h2.class('header')('hi there!'),
    button.onClick(onclick)('Click Me!'),
    p.class(className)(JSON.stringify(props.todos))
  )
}

function onclick (e, send) {
  console.log('clikgin!')
  send({
    type: 'state:todo:create',
    payload: {
      title: 'hi world'
    }
  })
}

const Page = component(function (props) {
  // console.log('props', props)
  let { children } = props

  if (props.css) {
    console.time('style');
    const styling = style({ afro: true })(String(props.css))
    children = children.map(child => walk(child, styles(props.css)))
    children = [styling].concat(props.children)
    console.timeEnd('style');
  }

  if (props.send) {
    walk(children, actions(props.send))
  }

  // also map the top-level class
  if (props.css && props.class) {
    props.class = props.css(props.class) || props.class
  }

  return div(props)(children)
})

let doRender = preact.render

function render (renderable, store, parent) {
  let root = null

  function render () {
    return doRender(renderable(store()), parent, root)
  }

  store.subscribe(function () {
    defer(render)
  })

  let vdom = renderable(store())
  root = doRender(vdom, parent)
  return root
}

render(App, store, document.body)

/**
 * Render the classnames
 */

function styles (css) {
  return function (node) {
    let attrs = node.attributes
    if (!attrs || !attrs.class) return
      console.log(attrs.class)
    attrs.class = css(attrs.class) || attrs.class
    return node
  }
}

/**
 * Actions
 */

function actions (send) {
  function Proxy (fn) {
    let proxy = (e) => fn(e, send)
    proxy.proxy = fn
    return proxy
  }

  return function (node) {
    let attrs = node.attributes
    if (!attrs) return
    for (let attr in attrs) {
      if (!~Events.indexOf(attr)) continue
      if (attrs[attr].proxy === attrs[attr]) continue
      attrs[attr] = Proxy(attrs[attr])
    }
  }
}

/**
 * Walk the vnode tree
 */

function walk (vnode, fn) {
  if (Array.isArray(vnode)) {
    return vnode.map(node => walk(node, fn))
  }

  fn(vnode)
  if (!vnode.children) return
  vnode.children.map(child => walk(child, fn))
}
