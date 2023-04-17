/* eslint-disable no-console */
let warned: Record<string, boolean> = {};

export type preMessageFn = (
  message: string,
  type: 'warning' | 'note',
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
      (msg, preMessageFn) => preMessageFn(msg ?? '', 'warning'),
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
      (msg, preMessageFn) => preMessageFn(msg ?? '', 'note'),
      message,
    );

    if (finalMessage) {
      console.warn(`Note: ${finalMessage}`);
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

warningOnce.preMessage = preMessage;
warningOnce.resetWarned = resetWarned;
warningOnce.noteOnce = noteOnce;

export default warningOnce;
/* eslint-enable */
