'use strict'

/**
 * Module Dependencies
 */

const Socrates = require('socrates')
const Stylesheet = require('afro')
const Effects = require('alley')
const preact = require('preact')
const rsplit = /\.?([^\s]+)/g
const sun = require('sun')

/**
 * Defer with fallback
 */

let resolved = typeof Promise !== 'undefined' && Promise.resolve()
const defer = resolved ? f => { resolved.then(f) } : setTimeout

/**
 * Initialize the vcom object
 */

const vcom = module.exports = {}

/**
 * DOM
 */

vcom.HTML = sun

/**
 * Attach CSS
 */

vcom.CSS = CSS

/**
 * Store
 */

vcom.Store = Socrates

/**
 * Effects
 */

vcom.Effects = Effects

/**
 * Stylesheet
 */

vcom.Stylesheet = Stylesheet

/**
 * Render
 */

vcom.render = Render

/**
 * Render
 */

function Render (renderable, parent, { effects, store, css, root } = {}) {
  let styles = typeof css === 'object' ? (key) => css[key] : css
  let transform = Transform({ css: styles, effects, rehydrating: !!root })

  root = root || parent.lastChild

  function render () {
    let state = typeof store === 'function' ? store() : store
    let vdom = typeof renderable === 'function'
      ? transform(renderable(state))
      : transform(renderable)

    root = preact.render(vdom, parent, root)
    return root
  }

  // subscribe to updates
  if (store && typeof store === 'function') {
    store.subscribe(() => defer(render))
  }

  return render()
}

/**
 * CSS transform
 */

function CSS () {
  let sheet = Stylesheet.apply(null, arguments)
  return function css (render) {
    if (!arguments.length) {
      return sheet.apply(null, arguments)
    } else if (typeof render === 'function') {
      return Stylize(render, sheet)
    } else if (render.nodeName) {
      const styles = Styles(sheet)
      return walk(render, node => styles(node))
    } else {
      sheet = sheet.apply(null, arguments)
      return css
    }
  }
}

/**
 * Stylize the render
 */

function Stylize (Render, css) {
  const styles = Styles(css)
  return function render () {
    const vnodes = Render.apply(Render, arguments)
    if (!vnodes) return vnodes
    return walk(vnodes, node => styles(node))
  }
}

/**
 * Transform vnodes
 */

function Transform ({ css, effects, rehydrating }) {
  let actions = Actions(effects)
  let styles = Styles(css)
  let mounts = Mounts({ rehydrating })
  return function transform (vnode) {
    return walk(vnode, node => {
      mounts(node)
      if (css) styles(node)
      if (effects) actions(node)
      return node
    })
  }
}

/**
 * Render the classnames
 */

function Styles (css) {
  return function styles (node) {
    let attrs = node.attributes
    if (!attrs || !attrs.class) return node
    attrs.class = selectors(attrs.class)
      .map(cls => css[cls] || cls)
      .join(' ')
    return node
  }
}

/**
 * Actions
 */

function Actions (effects) {
  return function actions (node) {
    let attrs = node.attributes
    if (!attrs) return node
    for (let attr in attrs) {
      if (typeof attrs[attr] !== 'function') continue
      let fn = attrs[attr]
      attrs[attr] = (e) => fn(e, effects.send)
    }
    return node
  }
}

/**
 * Mounts
 */

function Mounts ({ rehydrating }) {
  // if we're rehydrating from the
  // server, we'll want to run hooks
  // at least once on the client
  let firstMount = rehydrating

  return function mounts (node) {
    let attrs = node.attributes
    if (!attrs) return
    else if (!attrs.onMount && !attrs.onUnmount) return

    // create a mount using the ref
    let ref = node.attributes && node.attributes.ref
    node.attributes.ref = (el, send) => {
      const parent = el && el.parentNode
      if (attrs.onMount && el && (!parent || firstMount)) {
        firstMount = false
        // when initially mounted, el will
        // exist but there won't be a parent
        // we want to defer to ensure that
        // the dimensions have been calculated
        defer(function () { attrs.onMount(el, send) })
      } else if (attrs.onUnmount && !el && !parent) {
        // when unmounting, both el and
        // the parent will be null.
        defer(function () { attrs.onUnmount(null, send) })
      }

      // call original ref, if there is one
      ref && ref(el, send)
    }
  }
}

/**
 * Walk the vnode tree
 */

function walk (vnode, fn) {
  if (!vnode) return vnode
  fn(vnode)
  if (!vnode.children) return vnode
  vnode.children.map(child => walk(child, fn))
  return vnode
}

/**
 * Split into separate selectors
 */

function selectors (selectors) {
  const arr = []
  selectors.replace(rsplit, (m, s) => arr.push(s))
  return arr.filter(selector => !!selector)
}
