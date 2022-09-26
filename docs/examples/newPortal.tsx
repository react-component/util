import React, { version } from 'react';
import Portal from '../../src/React/Portal';

export default () => {
  const [show, setShow] = React.useState(true);
  const [customizeContainer, setCustomizeContainer] = React.useState(false);

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
        <div
          id="customize"
          ref={divRef}
          style={{ border: '1px solid green', minHeight: 10 }}
        />
      </div>

      <Portal open={show} getContainer={getContainer}>
        Hello Bamboo
        {/* <Portal open={show} getContainer={getContainer}>
          Hello Little!
        </Portal> */}
      </Portal>
    </React.StrictMode>
  );
};
