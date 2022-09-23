import React from 'react';
import Portal from '../src/React/Portal';

export default () => {
  return (
    <div style={{ background: 'red' }}>
      Real Content
      <Portal open>Hello World</Portal>
    </div>
  );
};
