<div align="center">
  <h1>@rc-component/util</h1>
  <p>🧰 Common React utilities shared across rc-component packages.</p>

  <a href="https://ant.design">
    <img width="32" height="32" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="Ant Design" />
  </a>

  <p>Part of the Ant Design ecosystem.</p>

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![bundle size][bundlephobia-image]][bundlephobia-url] [![dumi][dumi-image]][dumi-url]

</div>

[npm-image]: https://img.shields.io/npm/v/@rc-component/util.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@rc-component/util
[github-actions-image]: https://github.com/react-component/util/actions/workflows/react-component-ci.yml/badge.svg
[github-actions-url]: https://github.com/react-component/util/actions/workflows/react-component-ci.yml
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/util/master.svg?style=flat-square
[codecov-url]: https://app.codecov.io/gh/react-component/util
[download-image]: https://img.shields.io/npm/dm/@rc-component/util.svg?style=flat-square
[download-url]: https://npmjs.org/package/@rc-component/util
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/%40rc-component%2Futil?style=flat-square
[bundlephobia-url]: https://bundlephobia.com/package/@rc-component/util
[dumi-image]: https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square
[dumi-url]: https://github.com/umijs/dumi

## Highlights

- React 18+ compatible helpers used by rc-component packages.
- Ref composition, React 19 ref compatibility checks, and portal helpers.
- DOM helpers for focus management, dynamic styles, visibility, shadow roots, and scrollbar measurement.
- Hooks for controlled state, layout effects, stable callbacks, memo comparison, ids, and mobile detection.
- Small data utilities for object paths, shallow props merging, omission, equality checks, and child flattening.

## Install

```bash
npm install @rc-component/util
```

## Usage

```tsx | pure
import { useMergedState, warning } from '@rc-component/util';

export default function Demo() {
  const [open, setOpen] = useMergedState(false, {
    onChange: nextOpen => {
      warning(typeof nextOpen === 'boolean', '`open` should be boolean.');
    },
  });

  return (
    <button type="button" onClick={() => setOpen(!open)}>
      {open ? 'Close' : 'Open'}
    </button>
  );
}
```

Deep imports are also available when a package needs a single helper:

```ts | pure
import Portal from '@rc-component/util/es/Portal';
import { composeRef } from '@rc-component/util/es/ref';
import KeyCode from '@rc-component/util/es/KeyCode';
```

New code should prefer `@rc-component/util`. Legacy projects may still contain `rc-util` imports while they migrate to the scoped package.

## Examples

```bash
npm install
npm start
```

Then open <http://localhost:8000/>.

## API

### Hooks

| Export                                     | Description                                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `useControlledState`                       | Controlled/uncontrolled state helper for React 18+ projects.                                           |
| `useMergedState`                           | Legacy controlled/uncontrolled state helper with `defaultValue`, `value`, `onChange`, and `postState`. |
| `useEvent`                                 | Stable callback wrapper that always calls the latest handler.                                          |
| `useLayoutEffect`, `useLayoutUpdateEffect` | Layout effect helpers with server-side rendering guards.                                               |
| `useMemo`                                  | Memo helper with a custom comparison function.                                                         |
| `useState`                                 | State helper that can ignore updates after destroy.                                                    |
| `useSyncState`                             | Synchronous state getter and updater pair.                                                             |
| `useId`, `getId`                           | Stable id helpers.                                                                                     |

### Refs

| Export                         | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| `composeRef`, `useComposeRef`  | Merge multiple refs into a single ref callback.                          |
| `fillRef`                      | Assign a value to callback and object refs.                              |
| `getNodeRef`                   | Read refs from React elements, including the React 19 `props.ref` shape. |
| `supportRef`, `supportNodeRef` | Check whether a component or element can receive refs.                   |

### DOM

| Export                                       | Description                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| `canUseDom`                                  | Check whether DOM APIs are available.                                     |
| `contains`                                   | Check whether one DOM node contains another.                              |
| `getDOM`, `isDOM`                            | Resolve or test DOM nodes from refs and elements.                         |
| `getFocusNodeList`, `triggerFocus`           | Find focusable nodes and focus inputs with optional cursor placement.     |
| `lockFocus`, `useLockFocus`                  | Keep focus inside a container until the lock is released.                 |
| `injectCSS`, `updateCSS`, `removeCSS`        | Add, update, and remove dynamic style nodes with CSP and prepend support. |
| `getShadowRoot`                              | Resolve the shadow root for a node.                                       |
| `isStyleSupport`                             | Check browser style support.                                              |
| `isVisible`                                  | Check whether a DOM node is visible.                                      |
| `getScrollBarSize`, `getTargetScrollBarSize` | Measure global or target scrollbar size.                                  |

### React And Data Utilities

| Export                               | Description                                                           |
| ------------------------------------ | --------------------------------------------------------------------- |
| `Portal`                             | Render children into a specific container.                            |
| `render`, `unmount`                  | Compatibility wrappers for rendering and unmounting React roots.      |
| `toArray`                            | Convert React children to an array with optional keep-empty behavior. |
| `KeyCode`                            | Keyboard code enum and key event helpers.                             |
| `get`, `set`, `merge`, `mergeWith`   | Object path and merge helpers.                                        |
| `isEqual`                            | Equality check with optional shallow compare mode.                    |
| `mergeProps`                         | Merge React props while composing event handlers.                     |
| `omit`, `pickAttrs`, `proxyObject`   | Object and DOM attribute helpers.                                     |
| `raf`                                | RequestAnimationFrame wrapper with cancel support.                    |
| `isMobile`                           | Runtime mobile detection helper.                                      |
| `warning`, `noteOnce`, `resetWarned` | Development warnings with once-only helpers.                          |

### Test Helpers

| Export                                        | Description                                            |
| --------------------------------------------- | ------------------------------------------------------ |
| `spyElementPrototype`, `spyElementPrototypes` | Temporarily spy on element prototype methods in tests. |

## Development

```bash
npm install
npm start
```

```bash
npm test
npm run tsc
npm run lint
npm run compile
npm run build
```

## Release

```bash
npm run prepublishOnly
```

The release script compiles the package and runs `rc-np`.

## License

`@rc-component/util` is released under the MIT license.
