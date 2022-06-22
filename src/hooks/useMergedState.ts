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
  const [firstMount, setFirstMount] = React.useState(true);

  useLayoutEffect(() => {
    if (!firstMount) {
      return callback();
    }
  }, deps);

  // We tell react that first mount has passed
  useLayoutEffect(() => {
    setFirstMount(false);
  }, []);
};

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

    if (value !== undefined) {
      finalValue = value;
      source = Source.PROP;
    } else if (defaultValue !== undefined) {
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

  const postMergedValue = postState
    ? postState(mergedValue[0])
    : mergedValue[0];

  // ======================= Sync =======================
  useUpdateEffect(() => {
    setMergedValue(([prevValue]) => [value, Source.PROP, prevValue]);
  }, [value]);

  // ====================== Update ======================
  const triggerChange: Updater<T> = useEvent((updater, ignoreDestroy) => {
    setMergedValue(prev => {
      const [prevValue] = prev;

      const nextValue: T =
        typeof updater === 'function' ? (updater as any)(prevValue) : updater;

      // Do nothing if value not change
      if (nextValue === prevValue) {
        return prev;
      }

      return [nextValue, Source.INNER, prevValue];
    }, ignoreDestroy);
  });

  // ====================== Change ======================
  const onChangeFn = useEvent(onChange);

  useLayoutEffect(() => {
    const [current, source, prev] = mergedValue;
    if (current !== prev && source === Source.INNER) {
      onChangeFn?.(current, prev);
    }
  }, [mergedValue]);

  return [postMergedValue as unknown as R, triggerChange];
}
