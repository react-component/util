<div align="center">
  <h1>@rc-component/util</h1>
  <p><sub>Part of the Ant Design ecosystem.</sub></p>
  <p>🛠️ Shared React utilities for rc-component packages.</p>
  <p>
    <a href="https://www.npmjs.com/package/@rc-component/util"><img src="https://img.shields.io/npm/v/@rc-component/util.svg?style=flat-square" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@rc-component/util"><img src="https://img.shields.io/npm/dm/@rc-component/util.svg?style=flat-square" alt="npm downloads" /></a>
    <a href="https://github.com/react-component/util/actions/workflows/react-component-ci.yml"><img src="https://github.com/react-component/util/actions/workflows/react-component-ci.yml/badge.svg" alt="CI" /></a>
    <a href="https://app.codecov.io/gh/react-component/util"><img src="https://img.shields.io/codecov/c/github/react-component/util/master.svg?style=flat-square" alt="Codecov" /></a>
    <a href="https://bundlephobia.com/package/@rc-component/util"><img src="https://badgen.net/bundlephobia/minzip/@rc-component/util" alt="bundle size" /></a>
    <a href="https://github.com/umijs/dumi"><img src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square" alt="dumi" /></a>
  </p>
</div>


## Highlights

- Built for React and maintained by the rc-component team.
- Used by Ant Design and other React component libraries.
- Ships TypeScript declarations with both ES module and CommonJS outputs.
- Keeps examples, tests, and preview builds aligned with the package source.

> This package was historically published as `rc-util`. Prefer the scoped package for new code.

## Install

```bash
npm install @rc-component/util
```

## Usage

```tsx | pure
import {
  Portal,
  raf,
  useEvent,
  useLayoutEffect,
  warning,
} from '@rc-component/util';
```

## Examples

Run the local dumi site to explore the examples:

```bash
npm install
npm start
```

## API

The package exposes small, focused helpers used across rc-component and Ant Design packages. Import the public entry when possible, and use subpath imports for specialized DOM, React, or test helpers.

| Area            | Examples                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| React hooks     | `useEvent`, `useLayoutEffect`, `useMergedState`, `useState` helpers                |
| React utilities | `Children/toArray`, `composeRef`, `pickAttrs`, `Portal`                            |
| DOM utilities   | `Dom/canUseDom`, `Dom/contains`, `Dom/dynamicCSS`, `Dom/focus`, `getScrollBarSize` |
| Async helpers   | `raf`, `raf.cancel`                                                                |
| Warnings        | `warning`, `noteOnce`, `resetWarned`                                               |
| Tests           | `test/domHook` for DOM prototype spies                                             |

Examples in `docs/examples` cover the commonly used subpath helpers.

## Development

```bash
npm install
npm start
npm test
npm run build
```

## Release

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command after the package build.

## License

@rc-component/util is released under the [MIT](./LICENSE) license.
