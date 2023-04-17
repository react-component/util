/* eslint-disable no-console */
let warned: Record<string, boolean> = {};

export type preMessageFn = (
  type: 'warning' | 'note',
  message: string,
) => string | null | undefined | number;

const preWarningFns: preMessageFn[] = [];

/**
 * Pre warning enable you to parse content before console.error.
 * Modify to null will prevent warning.
 */
export const preMessage = (fn: preMessageFn) => {
  preWarningFns.push(fn);
};

export function warning(valid: boolean, message: string) {
  // Support uglify
  if (
    process.env.NODE_ENV !== 'production' &&
    !valid &&
    console !== undefined
  ) {
    const finalMessage = preWarningFns.reduce(
      (msg, preMessageFn) => preMessageFn('warning', msg ?? ''),
      message,
    );

    if (finalMessage) {
      console.error(`Warning: ${finalMessage}`);
    }
  }
}

export function note(valid: boolean, message: string) {
  // Support uglify
  if (
    process.env.NODE_ENV !== 'production' &&
    !valid &&
    console !== undefined
  ) {
    const finalMessage = preWarningFns.reduce(
      (msg, preMessageFn) => preMessageFn('note', msg ?? ''),
      message,
    );

    if (finalMessage) {
      console.warn(`Note: ${message}`);
    }
  }
}

export function resetWarned() {
  warned = {};
}

export function call(
  method: (valid: boolean, message: string) => void,
  valid: boolean,
  message: string,
) {
  if (!valid && !warned[message]) {
    method(false, message);
    warned[message] = true;
  }
}

export function warningOnce(valid: boolean, message: string) {
  call(warning, valid, message);
}

export function noteOnce(valid: boolean, message: string) {
  call(note, valid, message);
}

warningOnce.preMessageFn = preMessage;
warningOnce.resetWarned = resetWarned;
warningOnce.noteOnce = noteOnce;

export default warningOnce;
/* eslint-enable */
