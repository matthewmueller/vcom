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

function Render (renderable, parent, { effects, store, css } = {}) {
  let styles = typeof css === 'object' ? (key) => css[key] : css
  let transform = Transform({ css: styles, effects })
  let root = null

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
    if (typeof render === 'function') {
      return Stylize(render, sheet)
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

function Transform ({ css, effects }) {
  let actions = Actions(effects)
  let styles = Styles(css)
  return function transform (vnode) {
    return walk(vnode, node => {
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
