# getFormattedSelection

Adjust an input selection after its text is formatted, for example when a formatter adds a prefix or separators, or changes letter case.

```tsx | pure
import { getFormattedSelection } from '@rc-component/util';

// When the input changes, before formatting
const originStr = input.value;
const selection = { start: input.selectionStart, end: input.selectionEnd };
const targetStr = format(originStr);

// After rendering `targetStr`
const { start, end } = getFormattedSelection(originStr, selection, targetStr);
input.setSelectionRange(start, end);
```

```ts
interface SelectionRange {
  start: number;
  end: number;
}

function getFormattedSelection(
  originStr: string,
  selection: SelectionRange,
  targetStr: string,
): SelectionRange;
```

Each edge of the selection is placed by the first rule that applies:

| Rule                                                                        | `originStr` | Caret | `targetStr` | Result |
| --------------------------------------------------------------------------- | ----------- | ----- | ----------- | ------ |
| Keep it after the same text before it                                       | `5`         | 1     | `5%`        | 1      |
| Keep it before the same text after it                                       | `AbC`       | 2     | `ABC`       | 2      |
| Place it after the character before it, searched from its previous position | `9$ `       | 1     | `$ 9`       | 3      |
| Move it to the end when that character is gone                              | `abc`       | 1     | `xyz`       | 3      |

Offsets outside `originStr` are clamped, and the returned end is never before the start. The selection is not modified.
