import * as React from 'react';
import useEvent from './useEvent';
import useLayoutEffect from './useLayoutEffect';
import useState from './useState';

type Updater<T> = (
  updater: T | ((origin: T) => T),
  ignoreDestroy?: boolean,
) => void;

enum Source {
  INNER,
  PROP,
}

type ValueRecord<T> = [T, Source, T];

const useUpdateEffect: typeof React.useEffect = (callback, deps) => {
  const firstMountRef = React.useRef(true);

  useLayoutEffect(() => {
    if (!firstMountRef.current) {
      return callback();
    }
  }, deps);

  // We tell react that first mount has passed
  useLayoutEffect(() => {
    firstMountRef.current = false;
    return () => {
      firstMountRef.current = true;
    };
  }, []);
};

/** We only think `undefined` is empty */
function hasValue(value: any) {
  return value !== undefined;
}

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

  // ======================= Init =======================
  const [mergedValue, setMergedValue] = useState<ValueRecord<T>>(() => {
    let finalValue: T = undefined;
    let source: Source;

    if (hasValue(value)) {
      finalValue = value;
      source = Source.PROP;
    } else if (hasValue(defaultValue)) {
      finalValue =
        typeof defaultValue === 'function'
          ? (defaultValue as any)()
          : defaultValue;
      source = Source.PROP;
    } else {
      finalValue =
        typeof defaultStateValue === 'function'
          ? (defaultStateValue as any)()
          : defaultStateValue;
      source = Source.INNER;
    }

    return [finalValue, source, finalValue];
  });

  const chosenValue = hasValue(value) ? value : mergedValue[0];
  const postMergedValue = postState ? postState(chosenValue) : chosenValue;

  // ======================= Sync =======================
  useUpdateEffect(() => {
    setMergedValue(([prevValue]) => [value, Source.PROP, prevValue]);
  }, [value]);

  // ====================== Update ======================
  const changeEventPrevRef = React.useRef<T>();

  const triggerChange: Updater<T> = useEvent((updater, ignoreDestroy) => {
    setMergedValue(prev => {
      const [prevValue, prevSource, prevPrevValue] = prev;

      const nextValue: T =
        typeof updater === 'function' ? (updater as any)(prevValue) : updater;

      // Do nothing if value not change
      if (nextValue === prevValue) {
        return prev;
      }

      // Use prev prev value if is in a batch update to avoid missing data
      const overridePrevValue =
        prevSource === Source.INNER &&
        changeEventPrevRef.current !== prevPrevValue
          ? prevPrevValue
          : prevValue;

      return [nextValue, Source.INNER, overridePrevValue];
    }, ignoreDestroy);
  });

  // ====================== Change ======================
  const onChangeFn = useEvent(onChange);

  useLayoutEffect(() => {
    const [current, source, prev] = mergedValue;
    if (current !== prev && source === Source.INNER) {
      onChangeFn(current, prev);
      changeEventPrevRef.current = prev;
    }
  }, [mergedValue]);

  return [postMergedValue as unknown as R, triggerChange];
}
