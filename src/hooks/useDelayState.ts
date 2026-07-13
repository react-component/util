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
  const delayRef = React.useRef<[isRaf: boolean, delay: number] | null>(null);

  const cancelPending = useEvent(() => {
    if (delayRef.current) {
      const [isRaf, delay] = delayRef.current;
      if (isRaf) {
        raf.cancel(delay);
      } else {
        clearTimeout(delay);
      }
      delayRef.current = null;
    }
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
        delayRef.current = [
          false,
          window.setTimeout(() => setValue(nextValue), immediatelyOrDelay.ms),
        ];
      } else {
        const frame =
          typeof immediatelyOrDelay === 'object'
            ? immediatelyOrDelay.frame
            : undefined;
        delayRef.current = [true, raf(() => setValue(nextValue), frame)];
      }
    },
  );

  return [value, setDelayValue];
}
