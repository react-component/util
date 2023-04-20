// more config: https://d.umijs.org/config
import { defineConfig } from 'dumi';

const basePath = process.env.GITHUB_ACTIONS ? '/util/' : '/';
const publicPath = process.env.GITHUB_ACTIONS ? '/util/' : '/';

export default defineConfig({
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'Util',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
  outputPath: '.doc',
  exportStatic: {},
  base: basePath,
  publicPath,
});
