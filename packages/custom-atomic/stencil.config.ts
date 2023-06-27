import alias from '@rollup/plugin-alias';
import replacePlugin from '@rollup/plugin-replace';
import { Config } from '@stencil/core';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { readFileSync } from 'fs';
import path from 'path';
import html from 'rollup-plugin-html';
import { inlineSvg } from 'stencil-inline-svg';

const isProduction = process.env.BUILD === 'production';

function getPackageVersion(): string {
  return JSON.parse(readFileSync('package.json', 'utf-8')).version;
}

function replaceHeadlessMap() {
  return {
    name: 'replace-map-for-headless-dev',
    generateBundle: (options, bundle) => {
      const headlessBundle = Object.keys(bundle).find(bundle => bundle.indexOf('headless.esm') !== -1);
      if (!headlessBundle) {
        return;
      }

      bundle[headlessBundle].map = null;

      bundle[headlessBundle].code += '//# sourceMappingURL=./headless/headless.esm.js.map';
      return bundle;
    },
  };
}

function replace() {
  const env = isProduction ? 'production' : 'development';
  const version = getPackageVersion();
  return replacePlugin({
    'process.env.NODE_ENV': JSON.stringify(env),
    'process.env.VERSION': JSON.stringify(version),
    'preventAssignment': true,
  });
}

const isDevWatch: boolean = process.argv && process.argv.indexOf('--dev') > -1 && process.argv.indexOf('--watch') > -1;

export const config: Config = {
  namespace: 'atomic',
  taskQueue: 'async',
  outputTargets: [
    react({
      componentCorePackage: '@jcore/custom-atomic',
      proxiesFile: '../custom-atomic-react/src/components/stencil-generated/index.ts',
      includeDefineCustomElements: true,
      excludeComponents: ['atomic-result-template', 'atomic-recs-result-template', 'atomic-field-condition'],
    }),
    {
      type: 'dist-custom-elements',
    },
  ],
  testing: {
    browserArgs: ['--no-sandbox'],
    transform: {
      '^.+\\.html?$': 'html-loader-jest',
      '^.+\\.svg$': './svg.transform.js',
    },
    transformIgnorePatterns: [],
    testPathIgnorePatterns: ['.snap'],
    setupFiles: ['jest-localstorage-mock'],
    resetMocks: false,
  },
  devServer: {
    reloadStrategy: 'pageReload',
  },
  plugins: [
    // https://github.com/fabriciomendonca/stencil-inline-svg/issues/16
    inlineSvg(),
    replace(),
  ],
  rollupPlugins: {
    before: [
      isDevWatch &&
        alias({
          entries: [
            {
              find: '@coveo/headless/case-assist',
              replacement: path.resolve(__dirname, './src/external-builds/case-assist/headless.esm.js'),
            },
            {
              find: '@coveo/headless/insight',
              replacement: path.resolve(__dirname, './src/external-builds/insight/headless.esm.js'),
            },
            {
              find: '@coveo/headless',
              replacement: path.resolve(__dirname, './src/external-builds/headless.esm.js'),
            },
          ],
        }),
      html({
        include: 'src/templates/**/*.html',
      }),
      isDevWatch && replaceHeadlessMap(),
    ],
  },
};
