import * as React from 'react';
import raf from '../raf';
import useEvent from './useEvent';

export type DelayConfig =
  { frame: number; ms?: never } | { frame?: never; ms: number };

export type SetDelayState<T> = (
  nextValue: React.SetStateAction<T>,
  /** `true` updates immediately. `false` delays the update by one frame. */
  immediatelyOrDelay?: boolean | DelayConfig,
) => void;

/**
 * Similar to `useState`, but updates on the next frame by default.
 * Pending updates are always replaced by the latest one.
 */
export default function useDelayState<T>(
  defaultValue: T | (() => T),
): [T, SetDelayState<T>] {
  const [value, setValue] = React.useState(defaultValue);
  const rafRef = React.useRef<number>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const cancelPending = useEvent(() => {
    raf.cancel(rafRef.current!);
    clearTimeout(timeoutRef.current!);
    rafRef.current = null;
    timeoutRef.current = null;
  });

  const setDelayValue = useEvent<SetDelayState<T>>(
    (nextValue, immediatelyOrDelay) => {
      cancelPending();

      if (immediatelyOrDelay === true) {
        setValue(nextValue);
      } else if (
        typeof immediatelyOrDelay === 'object' &&
        'ms' in immediatelyOrDelay
      ) {
        timeoutRef.current = setTimeout(
          () => setValue(nextValue),
          immediatelyOrDelay.ms,
        );
      } else {
        const frame =
          typeof immediatelyOrDelay === 'object'
            ? immediatelyOrDelay.frame
            : undefined;
        rafRef.current = raf(() => setValue(nextValue), frame);
      }
    },
  );

  React.useEffect(() => cancelPending, [cancelPending]);

  return [value, setDelayValue];
}
