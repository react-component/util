import canUseDom from './Dom/canUseDom';

/** Is client side and not jsdom */
export default process.env.NODE_ENV !== 'test' && canUseDom();
