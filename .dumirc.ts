import { defineConfig } from 'dumi';
import path from 'path';

const basePath = process.env.GH_PAGES ? '/util/' : '/';
const publicPath = process.env.GH_PAGES ? '/util/' : '/';

export default defineConfig({
  alias: {
    '@rc-component/util$': path.resolve('src'),
    '@rc-component/util/es': path.resolve('src'),
    '@rc-component/util/es/*': path.resolve('src'),
    'rc-util$': path.resolve('src'),
    'rc-util/es': path.resolve('src'),
    'rc-util/es/*': path.resolve('src'),
  },
  mfsu: false,
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'Util',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
  outputPath: 'docs-dist',
  base: basePath,
  publicPath,
});
