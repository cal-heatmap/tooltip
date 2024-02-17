import { readFileSync, writeFileSync } from 'fs';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';

const pkg = JSON.parse(readFileSync('./package.json'));
const packageName = pkg.name.split('/').pop();

let basePlugins = [
  typescript(),
  json(),
  commonjs(),
  nodeResolve(),
  filesize(),
];

const productionPlugins = [
  babel({ babelHelpers: 'bundled', extensions: ['.ts'] }),
  postcss({
    extract: `${packageName}.css`,
    minimize: true,
    plugins: [autoprefixer],
  }),
];

if (!process.env.ROLLUP_WATCH) {
  basePlugins = basePlugins.concat(productionPlugins);
} else {
  basePlugins.push(
    postcss({
      extract: `${packageName}.css`,
    }),
  );
}

writeFileSync(
  './src/version.ts',
  `const VERSION = '${pkg.version.replace(
    /^v/,
    '',
  )}';\nexport default VERSION;\n`,
);

const exportConfig = (input, name, options = {}) => [
  {
    input,
    output: [
      {
        file: `dist/${packageName}.js`,
        name,
        format: 'umd',
      },
    ],
    plugins: basePlugins,
    ...options,
  },
  {
    input,
    watch: false,
    output: [
      {
        file: `dist/${packageName}.esm.js`,
        format: 'esm',
      },
    ],
    plugins: basePlugins,
    ...options,
  },
  {
    input,
    watch: false,
    output: [
      {
        compact: true,
        file: `dist/${packageName}.min.esm.js`,
        format: 'esm',
        sourcemap: true,
      },
      {
        compact: true,
        file: `dist/${packageName}.min.js`,
        name,
        format: 'umd',
        sourcemap: true,
      },
    ],
    plugins: [...basePlugins, terser()],
    ...options,
  },
];

export default [
  ...exportConfig('src/index.ts', 'Tooltip'),
];
