/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

function useEvent<T extends Function>(callback: T): T {
  const fnRef = React.useRef<any>();
  fnRef.current = callback;

  const memoFn = React.useCallback<T>(
    ((...args: any) => fnRef.current?.(...args)) as any,
    [],
  );

  return memoFn;
}

export default useEvent;
