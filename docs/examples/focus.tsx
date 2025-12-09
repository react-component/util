import React, { useRef } from 'react';
import {} from '../../src';

export default function FocusDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ padding: 32 }}>
      <h2>Focus Utils Demo</h2>

      {/* External buttons */}
      <button>External Button 1</button>

      {/* Middle container - Tab key cycling is limited within this area */}
      <div
        ref={containerRef}
        style={{
          border: '2px solid #1890ff',
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
