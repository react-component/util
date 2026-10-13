# useAllowClear

Normalize a boolean or object clear configuration into a single `AllowClearConfig` object.

```tsx | pure
import { useAllowClear } from '@rc-component/util';
import type { AllowClearConfig } from '@rc-component/util';

function useClearConfig(allowClear?: boolean | AllowClearConfig) {
  return useAllowClear(allowClear);
}
```

```ts
interface AllowClearConfig {
  clearIcon?: React.ReactNode;
  disabled?: boolean;
  tabIndex?: number;
  label?: string;
}

function useAllowClear(
  allowClear?: boolean | AllowClearConfig,
): AllowClearConfig;
```

| Input                  | Result                                                     |
| ---------------------- | ---------------------------------------------------------- |
| `undefined` or `false` | `{ disabled: true }`                                       |
| `true`                 | `{ disabled: false }`                                      |
| Object                 | A copy of the object with `disabled` defaulting to `false` |

All four fields are optional. Object fields are preserved, including `tabIndex: 0`, an empty `label`, and `clearIcon: null`. The input object is never modified. The result is memoized by the `allowClear` value or object reference.

Components should merge configuration and apply their own defaults **before** calling this hook. For example, a component that enables clearing by default can pass `allowClear ?? true`.

Components should treat `config.disabled` as disabling the clear entry: no clear button or space reserved solely for it. They remain responsible for rendering, default icons, localized `aria-label` text, button `tabIndex`, and their existing disabled, read-only, value, and event behavior. This hook only normalizes configuration.
