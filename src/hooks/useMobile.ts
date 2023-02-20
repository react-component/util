import { useLayoutEffect, useState } from 'react';
import isMobile from '../isMobile';

/**
 * Hook to detect if the user is on a mobile device
 * Notice that this hook will only detect the device type in effect, so it will work in SSR
 */
const useMobile = (): boolean => {
  const [mobile, setMobile] = useState(false);

  useLayoutEffect(() => {
    setMobile(isMobile());
  }, []);

  return mobile;
};

export default useMobile;
