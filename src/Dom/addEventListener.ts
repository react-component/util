import ReactDOM from 'react-dom';

export default function addEventListenerWrap(
  target: HTMLElement | Element | Window | Document,
  eventType: keyof DocumentEventMap,
  cb: (a: any) => any,
  option: boolean | AddEventListenerOptions,
) {
  /* eslint camelcase: 2 */
  const callback = ReactDOM.unstable_batchedUpdates
    ? function run(e: any) {
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
