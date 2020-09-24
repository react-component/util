import React from 'react';
import PortalWrapper from '../src/PortalWrapper';

export default () => {
  const divRef = React.useRef();

  React.useEffect(() => {
    console.log('>>>', divRef.current);
  }, []);

  return (
    <>
      <PortalWrapper forceRender>
        {() => <div ref={divRef}>2333</div>}
      </PortalWrapper>
    </>
  );
};
