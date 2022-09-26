import * as React from 'react';
import { updateCSS, removeCSS } from '../../Dom/dynamicCSS';
import getScrollBarSize from '../../getScrollBarSize';

let lockCount = 0;
let locked = false;

const UNIQUE_ID = `rc-util-locker-${Date.now()}`;

function syncLocker() {
  const nextLocked = lockCount > 0;
  if (locked !== nextLocked) {
    locked = nextLocked;

    if (locked) {
      const scrollbarSize = getScrollBarSize();
      updateCSS(
        `
html body {
  overflow-y: hidden;
  width: calc(100% - ${scrollbarSize}px);
}`,
        UNIQUE_ID,
      );
    } else {
      removeCSS(UNIQUE_ID);
    }
  }
}

export default function useScrollLocker(lock?: boolean) {
  React.useLayoutEffect(() => {
    if (lock) {
      lockCount += 1;
      syncLocker();
    } else {
      lockCount -= 1;
      syncLocker();
    }
  }, [lock]);

  const lockRef = React.useRef(lock);
  lockRef.current = lock;

  React.useLayoutEffect(() => {
    return () => {
      if (lockRef.current) {
        lockCount -= 1;
        syncLocker();
      }
    };
  }, []);
}
