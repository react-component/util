import warning from 'warning';

let warned: Record<string, boolean> = {};

export function resetWarned() {
  warned = {};
}

export default (valid: boolean, message: string): void => {
  if (!valid && !warned[message]) {
    warning(false, message);
    warned[message] = true;
  }
};
