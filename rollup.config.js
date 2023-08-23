import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import vue from 'rollup-plugin-vue';
import { babel } from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss';

const babelOptions = {
  presets: [
    "@babel/preset-env"
  ],
  plugins: [
    "@babel/plugin-proposal-optional-chaining", // 可选链 ?.
    "@babel/plugin-proposal-nullish-coalescing-operator", // 空值合并 ??
  ],
  babelHelpers: 'bundled',
  exclude: 'node_modules/**'
}

const isProduction = process.env.NODE_ENV === 'production'
const pluginsWithEnv = isProduction ? [terser()] : [serve({
  contentBase: ['dist', 'example']
}), livereload('dist')]


export default [{
  input: 'src/App.vue',
  output: { 
    file: 'dist/calender-picker.js',
    format: 'umd',
    name: 'CalenderPicker'
  },
  plugins: [
    peerDepsExternal(),
    vue(),
    postcss({
      minimize: isProduction,
      use: ['sass'],
    }),
    resolve(), 
    commonjs(),
    babel(babelOptions),
    ...pluginsWithEnv,
   
  ]
}, {
  input: 'src/App.vue', 
  output: { 
    file: 'dist/calender-picker.esm.js',
    format: 'esm',
  },
  plugins: [ 
    peerDepsExternal(),
    vue(),
    postcss({
      minimize: isProduction,
      use: ['sass'],
    }),
    resolve(), 
    commonjs(),
    babel(babelOptions),
    ...pluginsWithEnv,
  ]
}];
