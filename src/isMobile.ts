import isMobile from 'is-mobile';

let cached: boolean;

const getIsMobile = () => {
  if (typeof cached === 'undefined') {
    cached = isMobile();
  }
  return cached;
};

export default getIsMobile;
