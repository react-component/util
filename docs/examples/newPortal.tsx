import React, { version } from 'react';
import Portal from '../../src/React/Portal';

export default () => {
  const [show, setShow] = React.useState(true);
  const [customizeContainer, setCustomizeContainer] = React.useState(false);
  const [lock, setLock] = React.useState(true);

  const divRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(
    () => () => {
      console.log('Demo unmount!!');
    },
    [],
  );

  const getContainer = customizeContainer ? () => divRef.current : undefined;

  return (
    <React.StrictMode>
      <div style={{ border: '2px solid red' }}>
        Real Version: {version}
        <button onClick={() => setShow(!show)}>show: {show.toString()}</button>
        <button onClick={() => setCustomizeContainer(!customizeContainer)}>
          customize container: {customizeContainer.toString()}
        </button>
        <button onClick={() => setLock(!lock)}>
          lock scroll: {lock.toString()}
        </button>
        <div
          id="customize"
          ref={divRef}
          style={{ border: '1px solid green', minHeight: 10 }}
        />
      </div>

      <Portal open={show} getContainer={getContainer} autoLock={lock}>
        <p>Hello Root</p>
        <Portal open={show} getContainer={getContainer} autoLock={lock}>
          <p>Hello Parent</p>
          <Portal open={show} getContainer={getContainer} autoLock={lock}>
            <p>Hello Children</p>
          </Portal>
        </Portal>
      </Portal>

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '200vh',
          width: 1,
          background: 'yellow',
          zIndex: -1,
        }}
      />
    </React.StrictMode>
  );
};
