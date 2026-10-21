import React, { useRef, useState } from 'react';
import { useLockFocus } from '../../src/Dom/focus';

export default function FocusBoundaryDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(true);
  useLockFocus(locked, () => ref.current);

  return (
    <>
      <p>
        Tab and Shift+Tab should cycle between the two buttons. Escape releases
        the focus lock.
      </p>
      <div
        ref={ref}
        onKeyDown={event => {
          if (event.key === 'Escape') setLocked(false);
        }}
      >
        <button>First</button>
        <button>Last</button>
      </div>
    </>
  );
}
