import isMobile from 'is-mobile';

let cached: boolean;

export default () => {
  if (typeof cached === 'undefined') {
    cached = isMobile();
  }

  return cached;
};
