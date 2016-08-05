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
