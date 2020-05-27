let raf = (fn: () => void) => +setTimeout(fn, 16);
let caf = (num: number) => clearTimeout(num);

if (typeof window !== 'undefined') {
  raf = requestAnimationFrame;
  caf = cancelAnimationFrame;
}

// Support call raf with delay specified frame
export default function wrapperRaf(callback: () => void): number {
  return raf(callback);
}

wrapperRaf.cancel = caf;
