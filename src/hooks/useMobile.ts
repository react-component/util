import { useEffect, useState } from 'react';
import isMobile from '../isMobile';

/**
 * Hook to detect if the user is on a mobile device
 * Notice that this hook will only detect the device type in effect, so it will not work in SSR
 */
const useMobile = (): boolean => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  return mobile;
};

export default useMobile;
