<div align="center">
  <h1>@rc-component/util</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
  <p>🛠️ rc-component 共享工具集合，包含 DOM、React 和测试辅助能力。</p>
  <p>
    <a href="https://www.npmjs.com/package/@rc-component/util"><img src="https://img.shields.io/npm/v/@rc-component/util.svg?style=flat-square" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@rc-component/util"><img src="https://img.shields.io/npm/dm/@rc-component/util.svg?style=flat-square" alt="npm downloads" /></a>
    <a href="https://github.com/react-component/util/actions/workflows/react-component-ci.yml"><img src="https://github.com/react-component/util/actions/workflows/react-component-ci.yml/badge.svg" alt="CI" /></a>
    <a href="https://app.codecov.io/gh/react-component/util"><img src="https://img.shields.io/codecov/c/github/react-component/util/master.svg?style=flat-square" alt="Codecov" /></a>
    <a href="https://bundlephobia.com/package/@rc-component/util"><img src="https://badgen.net/bundlephobia/minzip/@rc-component/util" alt="bundle size" /></a>
    <a href="https://github.com/umijs/dumi"><img src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square" alt="dumi" /></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>


## 特性

- 面向 React 构建，并由 rc-component 团队维护。
- 被 Ant Design 使用和其他 React 组件库使用。
- 提供 TypeScript 类型声明，同时输出 ES module 和 CommonJS 产物。
- 示例、测试和预览构建与包源码保持一致。

> 该包历史上曾以 `rc-util` 发布。新代码推荐使用带 scope 的包名。

## 安装

```bash
npm install @rc-component/util
```

## 使用

```tsx | pure
import {
  Portal,
  raf,
  useEvent,
  useLayoutEffect,
  warning,
} from '@rc-component/util';
```

## 示例

运行本地 dumi 站点：

```bash
npm install
npm start
```

然后打开 `http://localhost:8000`。

## API

该包提供在 rc-component 和 Ant Design 包中复用的小型聚焦工具。优先导入公开入口；针对 DOM、React 或测试辅助能力，可使用子路径导入。

| 范围            | 示例                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| React hooks     | `useEvent`, `useLayoutEffect`, `useMergedState`, `useState` 辅助方法               |
| React 工具      | `Children/toArray`, `composeRef`, `pickAttrs`, `Portal`                            |
| DOM 工具        | `Dom/canUseDom`, `Dom/contains`, `Dom/dynamicCSS`, `Dom/focus`, `getScrollBarSize` |
| 异步辅助方法    | `raf`, `raf.cancel`                                                                |
| 警告工具        | `warning`, `noteOnce`, `resetWarned`                                               |
| 测试工具        | `test/domHook` 用于 DOM 原型 spy                                                   |

`docs/examples` 中的示例覆盖了常用的子路径辅助工具。

## 本地开发

```bash
npm install
npm start
npm test
npm run build
```

dumi 站点默认运行在 `http://localhost:8000`。

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/util 基于 [MIT](./LICENSE) 许可证发布。
