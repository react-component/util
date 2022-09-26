import React, { version } from 'react';
import Portal from '../../src/React/Portal';

export default () => {
  const [show, setShow] = React.useState(true);

  React.useEffect(() => () => {
    console.log('Demo unmount!!');
  }, []);

  return (
    <React.StrictMode>
      <div style={{ background: 'red' }}>
        Real Version: {version}
        <button onClick={() => setShow(!show)}>show: {show.toString()}</button>
        <Portal open={show} debugMark="parent">
          Hello Bamboo
          <Portal open={show} debugMark="children">
            Hello Little!
          </Portal>
        </Portal>
      </div>
    </React.StrictMode>
  );
};
