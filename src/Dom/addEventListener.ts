import ReactDOM from 'react-dom';

function addEventListenerWrap<K extends keyof ElementEventMap>(
  target: Element | Window | Document,
  eventType: K,
  cb: EventListener,
  option?: boolean | EventListenerOptions,
) {
  /* eslint camelcase: 2 */
  const callback: EventListener = ReactDOM.unstable_batchedUpdates
    ? function run(e) {
        ReactDOM.unstable_batchedUpdates(cb, e);
      }
    : cb;
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, option);
  }
  return {
    remove() {
      if (target.removeEventListener) {
        target.removeEventListener(eventType, callback, option);
      }
    },
  };
}

export default addEventListenerWrap;
