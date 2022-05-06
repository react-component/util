import noop from './noop';

type Warning = (valid: boolean, message: string) => void;
type Call = (method: Warning, valid: boolean, message: string) => void;

let warned: Record<string, boolean>;

export let warning: Warning = noop;
export let note: Warning = noop;
export let resetWarned = noop;
export let call: Call = noop;
export let warningOnce: Warning = noop;
export let noteOnce: Warning = noop;

if (process.env.NODE_ENV !== 'production') {
  warned = {};

  warning = function (valid, message) {
    if (!valid) {
      // eslint-disable-next-line no-console
      console.error(`Warning: ${message}`);
    }
  };

  note = function (valid, message) {
    if (!valid) {
      // eslint-disable-next-line no-console
      console.warn(`Note: ${message}`);
    }
  };

  resetWarned = function () {
    warned = {};
  };

  call = function (method, valid, message) {
    if (!valid && !warned[message]) {
      method(false, message);
      warned[message] = true;
    }
  };

  warningOnce = function (valid, message) {
    call(warning, valid, message);
  };

  noteOnce = function (valid, message) {
    call(note, valid, message);
  };
}

export default warningOnce;
