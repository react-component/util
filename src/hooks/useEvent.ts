/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

function useEvent<T extends (...args: any[]) => any>(
  callback: T | undefined,
): T {
  const fnRef = React.useRef<T | undefined>(callback);
  fnRef.current = callback;

  const memoFn = React.useCallback(
    ((...args) => fnRef.current?.(...args)) as T,
    [],
  );

  return memoFn;
}

export default useEvent;
