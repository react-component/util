let raf = (fn: () => void) => +setTimeout(fn, 16);
let caf = (num: number) => clearTimeout(num);

if (typeof window !== 'undefined') {
  raf = requestAnimationFrame;
  caf = cancelAnimationFrame;
}

export default function wrapperRaf(callback: () => void): number {
  return raf(callback);
}

wrapperRaf.cancel = caf;
