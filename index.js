/**
 * Module Dependencies
 */

var afro = require('afro')
var sun = require('sun')

/**
 * Initialize the vcom object
 */

var vcom = module.exports = {}

/**
 * Attach
 */

for (var fn in sun) {
  vcom[fn] = sun[fn]
}

/**
 * Attach CSS
 */

vcom.CSS = afro

/**
 * Styles
 */

vcom.styles = styles

/**
 * Render the classnames
 */

function styles (vnode, css) {
  walk(vnode, function (node) {
    if (!node.attributes || !node.attributes.class) return
    node.attributes.class = css(node.attributes.class)
  })
  return vnode
}

/**
 * Walk the vnode tree
 */

function walk (vnode, fn) {
  if (!vnode.children) return fn(vnode)
  let len = vnode.children.length
  for (let i = 0; i < len; i++) {
    walk(vnode.children[i], fn)
  }
  fn(vnode)
}
