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

/**
 * Warning if condition not match.
 * @param valid Condition
 * @param message Warning message
 * @example
 * ```js
 * warning(false, 'some error'); // print some error
 * warning(true, 'some error'); // print nothing
 * warning(1 === 2, 'some error'); // print some error
 * ```
 */
export function warning(valid: boolean, message: string) {
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

/** @see Similar to {@link warning} */
export function note(valid: boolean, message: string) {
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

/** @see Same as {@link warning}, but only warn once for the same message */
export function warningOnce(valid: boolean, message: string) {
  call(warning, valid, message);
}

/** @see Same as {@link warning}, but only warn once for the same message */
export function noteOnce(valid: boolean, message: string) {
  call(note, valid, message);
}

warningOnce.preMessage = preMessage;
warningOnce.resetWarned = resetWarned;
warningOnce.noteOnce = noteOnce;

export default warningOnce;
