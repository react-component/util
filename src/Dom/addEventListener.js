import ReactDOM from 'react-dom';

export default function addEventListenerWrap(target, eventType, cb, option) {
  /* eslint camelcase: 2 */
  const callback = ReactDOM.unstable_batchedUpdates
    ? function run(e) {
        ReactDOM.unstable_batchedUpdates(cb, e);
      }
    : cb;
  target.addEventListener(eventType, callback, option);
  return {
    remove: () => {
      target.removeEventListener(eventType, callback);
    },
  };
}
