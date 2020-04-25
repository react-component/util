import * as React from 'react';

export default function useControlledState<T, R = T>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T);
    value?: T;
    onChange?: (value: T, prevValue: T) => void;
    postState?: (value: T) => T;
  },
): [R, (value: T) => void] {
  const { defaultValue, value, onChange, postState } = option || {};
  const [innerValue, setInnerValue] = React.useState<T>(() => {
    if (value !== undefined) {
      return value;
    }
    if (defaultValue !== undefined) {
      return typeof defaultValue === 'function'
        ? (defaultValue as any)()
        : defaultValue;
    }
    return typeof defaultStateValue === 'function'
      ? (defaultStateValue as any)()
      : defaultStateValue;
  });

  let mergedValue = value !== undefined ? value : innerValue;
  if (postState) {
    mergedValue = postState(mergedValue);
  }

  function triggerChange(newValue: T) {
    setInnerValue(newValue);
    if (mergedValue !== newValue && onChange) {
      onChange(newValue, mergedValue);
    }
  }

  // Effect of reset value to `undefined`
  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (value === undefined) {
      setInnerValue(value);
    }
  }, [value]);

  return [(mergedValue as unknown) as R, triggerChange];
}
