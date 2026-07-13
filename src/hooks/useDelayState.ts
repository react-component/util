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

type DelayInfo =
  | [isRaf: true, delay: number]
  | [isRaf: false, delay: ReturnType<typeof setTimeout>];

/**
 * Similar to `useState`, but updates on the next frame by default.
 * Pending updates are always replaced by the latest one.
 */
export default function useDelayState<T>(
  defaultValue: T | (() => T),
): [T, SetDelayState<T>] {
  const [value, setValue] = React.useState(defaultValue);
  const delayRef = React.useRef<DelayInfo | null>(null);

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
      const delayConfig = immediatelyOrDelay || { frame: 1 };
      cancelPending();

      if (delayConfig === true) {
        setValue(nextValue);
      } else if ('ms' in delayConfig) {
        delayRef.current = [
          false,
          setTimeout(() => setValue(nextValue), delayConfig.ms),
        ];
      } else {
        delayRef.current = [
          true,
          raf(() => setValue(nextValue), delayConfig.frame),
        ];
      }
    },
  );

  return [value, setDelayValue];
}
