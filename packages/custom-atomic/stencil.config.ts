import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'custom-atomic',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
};
