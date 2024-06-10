import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import { resolve, dirname } from 'path';
import { peerDependencies, name as _name, main, module } from './package.json';

const __dirname = dirname('.');

const input = 'src/imports.ts';
const libFolder = 'dist';
const entries = [
  { find: '@', replacement: resolve(__dirname, 'src') },
  { find: '@hooks', replacement: resolve(__dirname, 'src', 'hooks') },
  { find: '@utils', replacement: resolve(__dirname, 'src', 'utils') },
  { find: '@store', replacement: resolve(__dirname, 'src', 'store') },
  { find: '@context', replacement: resolve(__dirname, 'src', 'context') },
  { find: '@styles', replacement: resolve(__dirname, 'src', 'styles') },
  { find: '@helpers', replacement: resolve(__dirname, 'src', 'helpers') },
  {
    find: '@components',
    replacement: resolve(__dirname, 'src', 'components'),
  },
];
const files = [
  { src: 'package.json', dest: libFolder },
  { src: 'README.md', dest: libFolder },
  { src: 'CHANGELOG.md', dest: libFolder },
  { src: '.gitignore', dest: libFolder },
  {
    src: '.tsconfig.build.json',
    rename: 'tsconfig.json',
    dest: libFolder,
  },
];

export default [
  {
    input,
    external: [...Object.keys(peerDependencies || {})],
    plugins: [
      external(),
      copy({ targets: files }),
      alias({ entries }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [['@babel/preset-react', { runtime: 'automatic' }]],
        extensions: ['.ts', '.tsx'],
      }),
      nodeResolve({ extensions: ['.ts', '.tsx'] }),
      commonjs({ extensions: ['.js', '.ts'] }),
      json(),
      css(),
      terser(),
    ],
    output: [
      {
        file: main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        name: _name,
      },
      {
        file: module,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
        name: _name,
      },
    ],
  },
];
