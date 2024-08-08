import { Options, defineConfig, Format } from 'tsup';
import svgr from 'esbuild-plugin-svgr';
import path from 'path';

function SVG(asName = 'ReactComponent') {
  return function (code: string, config: any, info: any) {
    return (
      code.replace(/import(.*?)from "react";/, '//not import react ') +
      `export const ${asName} = ${info.componentName}`
    );
  };
}

const tsconfig = path.resolve(__dirname, './tsconfig.build.json');
const name: string = 'reaflet';
const plugins = [
  svgr({
    dimensions: false,
    plugins: ['@svgr/plugin-jsx', SVG()],
    svgo: false,
    titleProp: true,
  }),
];

const createConfig = (
  entry: string[],
  format: Format[],
  outDir: string,
): Options => {
  return {
    dts: {
      entry: entry[0],
      resolve: true,
    },
    clean: true,
    shims: true,
    bundle: true,
    sourcemap: true,
    skipNodeModulesBundle: true,
    name,
    tsconfig,

    platform: 'browser',
    minify: 'terser',
    entry,
    format,
    outDir,
    external: [
      'leaflet',
      'leaflet.heat',
      'leaflet.markercluster',
      'rbush',
      'react',
      'react-dom',
      'react-full-screen',
      'zustand',
      '@types/leaflet',
      '@types/leaflet.heat',
      '@types/leaflet.markercluster',
    ],
    esbuildPlugins: plugins,
  };
};

const config = defineConfig([
  createConfig(['./src/index.ts'], ['cjs'], 'dist/cjs'),
  createConfig(['./src/index.ts'], ['esm'], 'dist/esm'),
  createConfig(['./src/helpers.ts'], ['esm'], 'dist/esm'),
  createConfig(['./src/helpers.ts'], ['esm'], 'dist/esm'),
  createConfig(['./src/factory.ts'], ['cjs'], 'dist/cjs'),
  createConfig(['./src/factory.ts'], ['esm'], 'dist/esm'),
  createConfig(['./src/performance.ts'], ['cjs'], 'dist/cjs'),
  createConfig(['./src/performance.ts'], ['esm'], 'dist/esm'),
]);

export default config;
