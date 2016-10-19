/**
 * Module Dependencies
 */

let { HTML, render, Store } = require('..')
let { div, h1 } = HTML
let store = Store()

const App = ({ url }) => (
  div.class('app').onMount(load).onUnmount(unload).onClick(route)(
    url === '/' && h1.key('/').onMount(root).onUnmount(unroot)(`${url}`),
    url === '/name' && h1.key('name').onMount(name).onUnmount(unname)(`${url}`),
    h1.onMount(consistent).onUnmount(unconsistent)('consistent')
  )
)

function load (el, send) {
  console.log('LOAD')
}
function unload (el, send) {
  console.log('UNLOAD')
}

function root (el, send) {
  console.log('ROOT')
}

function unroot (el, send) {
  console.log('UNROOT')
}

function name (el, send) {
  console.log('NAME')
}

function unname (el, send) {
  console.log('UNNAME')
}

function consistent (el, send) {
  console.log('CONSISTENT')
}

function unconsistent (el, send) {
  console.log('UNCONSISTENT')
}

function route () {
  store().url === '/'
    ? store('set:url', '/name')
    : store('set:url', '/')
}

store('set:url', '/')

render(App, document.body, {
  store
})

// setInterval(function () {
//   i--
//   render(App({ name: 'Matt' }), document.body, {
//     root: document.body.lastChild,
//     effects,
//     store
//   })
// }, 500)

// function mount (el, send) {
//   console.log('mounting!')
// }

// function unmount (el, send) {
//   console.log('unmounting!')
// }
