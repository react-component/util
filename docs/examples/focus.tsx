import React, { useRef } from 'react';
import {} from '../../src';
import { useLockFocus } from '../../src/Dom/focus';
import './focus.css';

export default function FocusDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [locking, setLocking] = React.useState(true);

  useLockFocus(locking, () => containerRef.current);

  return (
    <div style={{ padding: 32 }} className="focus-demo">
      <h2>Focus Utils Demo</h2>

      {/* External buttons */}
      <button onClick={() => setLocking(!locking)}>
        Lock ({String(locking)})
      </button>

      {/* Middle container - Tab key cycling is limited within this area */}
      <div
        ref={containerRef}
        tabIndex={0}
        style={{
          border: '2px solid green',
          padding: 24,
          margin: 16,
          borderRadius: 8,
          backgroundColor: '#f0f8ff',
        }}
      >
        <button>Container Button 1</button>
        <button>Container Button 2</button>
        <button>Container Button 3</button>
      </div>

      {/* External buttons */}
      <button>External Button 2</button>
    </div>
  );
}
