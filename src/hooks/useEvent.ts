import React from 'react';
import { useState } from 'react';

type StableHandler<This, Args extends unknown[], Result> = (
  this: This,
  ...args: Args
) => Result;

function useEvent<This, Args extends unknown[], Result>(
  fn: StableHandler<This, Args, Result>,
): StableHandler<This, Args, Result>;

function useEvent<
  This = unknown,
  Args extends unknown[] = [],
  Result = undefined,
>(
  fn?: StableHandler<This, Args, Result>,
): StableHandler<This, Args, Result | undefined>;

function useEvent<This, Args extends unknown[], Result>(
  callback?: StableHandler<This, Args, Result>,
) {
  const fnRef = React.useRef<StableHandler<This, Args, Result>>(callback);
  fnRef.current = callback;

  const [stableHandler] = useState(() => {
    return function (this: This, ...args: Args) {
      return fnRef.current?.apply(this, args);
    };
  });

  return stableHandler;
}

export default useEvent;
