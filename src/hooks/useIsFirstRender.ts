import * as React from 'react';

export default function useIsFirstRender(): boolean {
  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    firstRenderRef.current = false;
    return () => {
      firstRenderRef.current = true;
    };
  }, []);
  return firstRenderRef.current;
}
