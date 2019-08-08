module.exports = {
  testURL: 'http://localhost',
  transform: {
    '\\.(j|t)sx?$': './node_modules/rc-tools/scripts/jestPreprocessor.js',
  },
  collectCoverageFrom: [
    'src/*'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
};
