import React from 'react';
import PortalWrapper from '../src/PortalWrapper';

export default () => {
  const divRef = React.useRef();
  const outerRef = React.useRef();

  React.useEffect(() => {
    console.log('>>>', divRef.current);
  }, []);

  return (
    <>
      <PortalWrapper visible getContainer={() => outerRef.current}>
        {() => <div ref={divRef}>2333</div>}
      </PortalWrapper>
      <div style={{ background: 'red', height: 20 }} ref={outerRef} />
    </>
  );
};
