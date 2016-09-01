import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import json from 'rollup-plugin-json'

export default {
  exports: 'default',
  useStrict: false,
  external: [],
  plugins: [
    json(),
    nodeResolve({
      main: true
    }),
    commonjs({
      include: '**/*'
    }),
    buble({
      exclude: 'node_modules'
    })
  ]
}
