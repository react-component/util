/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

function useEvent<T extends ((...args: any[]) => any) | undefined>(
  callback: T,
): undefined extends T
  ? (
      ...args: Parameters<NonNullable<T>>
    ) => ReturnType<NonNullable<T>> | undefined
  : T {
  const fnRef = React.useRef<T | undefined>(callback);
  fnRef.current = callback;

  const memoFn = React.useCallback(
    (...args: any[]) => fnRef.current?.(...args),
    [],
  );

  return memoFn;
}

export default useEvent;
