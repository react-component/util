---
title: getScrollBarSize
nav:
  title: Demo
  path: /demo
---

<code src="../examples/getScrollBarSize.tsx"></code>

When using a Content Security Policy that requires a style nonce, pass the CSP
config as the second argument to `getTargetScrollBarSize`. The nonce is applied
to the temporary styles used for measurement:

```ts
getTargetScrollBarSize(element, { nonce: 'your-nonce' });
```

Components using Ant Design's `ConfigProvider` should forward its `csp` config
to this argument. This utility does not read React context automatically.
