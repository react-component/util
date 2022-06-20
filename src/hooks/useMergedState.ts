import * as React from 'react';
import useEvent from './useEvent';
import useLayoutEffect from './useLayoutEffect';
import useState from './useState';

type Updater<T> = (
  updater: T | ((origin: T) => T),
  ignoreDestroy?: boolean,
) => void;

/**
 * Similar to `useState` but will use props value if provided.
 * Note that internal use rc-util `useState` hook.
 */
export default function useMergedState<T, R = T>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T);
    value?: T;
    onChange?: (value: T, prevValue: T) => void;
    postState?: (value: T) => T;
  },
): [R, Updater<T>] {
  const { defaultValue, value, onChange, postState } = option || {};
  const [innerValue, setInnerValue] = useState<T>(() => {
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

  const mergedValue = value !== undefined ? value : innerValue;
  const postMergedValue = postState ? postState(mergedValue) : mergedValue;

  // setState
  const onChangeFn = useEvent(onChange);

  const [changePrevValue, setChangePrevValue] = React.useState<T>();

  const triggerChange: Updater<T> = useEvent((updater, ignoreDestroy) => {
    setChangePrevValue(mergedValue);
    setInnerValue(prev => {
      const nextValue =
        typeof updater === 'function' ? (updater as any)(prev) : updater;
      return nextValue;
    }, ignoreDestroy);
  });

  // Effect to trigger onChange
  useLayoutEffect(() => {
    if (changePrevValue !== undefined && changePrevValue !== innerValue) {
      onChangeFn?.(innerValue, changePrevValue);
    }
  }, [changePrevValue, innerValue, onChangeFn]);

  // Effect of reset value to `undefined`
  const prevValueRef = React.useRef(value);
  React.useEffect(() => {
    if (value === undefined && value !== prevValueRef.current) {
      setInnerValue(value);
    }

    prevValueRef.current = value;
  }, [value]);

  return [postMergedValue as unknown as R, triggerChange];
}
