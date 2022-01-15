const hasWin = typeof window !== 'undefined';
const hasRaf = hasWin && typeof window.requestAnimationFrame !== 'undefined';
const hasWeakSet = hasWin && typeof window.WeakSet !== 'undefined';

let raf = (callback: FrameRequestCallback) => +setTimeout(callback, 16);
let caf = (num: number) => clearTimeout(num);

if (hasRaf) {
  raf = (callback: FrameRequestCallback) =>
    window.requestAnimationFrame(callback);
  caf = (handle: number) => window.cancelAnimationFrame(handle);
}

let rafUUID = 0;
const rafMapIds = new Map<number, number>();
const rafWeakMapKeys = new WeakSet<number[]>();

const mapRafCleanup = (id: number) => rafMapIds.delete(id);

const mapUseRaf = (callback: () => void, times = 1): number => {
  rafUUID += 1;
  const id = rafUUID;

  function callRef(leftTimes: number) {
    if (leftTimes === 0) {
      // Clean up
      mapRafCleanup(id);

      // Trigger
      callback();
    } else {
      // Next raf
      const realId = raf(() => {
        callRef(leftTimes - 1);
      });

      // Bind real raf id
      rafMapIds.set(id, realId);
    }
  }

  callRef(times);

  return id;
};

mapUseRaf.cancel = (key: number) => {
  const realId = rafMapIds.get(key);
  mapRafCleanup(key);
  return caf(realId);
};

const weakMapRafCleanup = (key: number[]) => {
  const [timeId] = key || [];
  let oldKey = key;
  if (timeId) {
    caf(timeId);
    rafWeakMapKeys.delete(oldKey);
    const bool = !!rafWeakMapKeys.has(oldKey);
    oldKey = null;
    return bool;
  } else {
    return false;
  }
};

const weakMapUseRaf = (callback: () => void, times = 1): number => {
  let key: number[];

  function callRef(leftTimes: number) {
    if (leftTimes === 0) {
      // Clean up
      weakMapRafCleanup(key);

      // Trigger
      callback();
    } else {
      // Next raf
      key = [
        raf(() => {
          callRef(leftTimes - 1);
        }),
      ];

      rafWeakMapKeys.add(key);
    }
  }

  callRef(times);

  return +key;
};

weakMapUseRaf.cancel = (key: number[]) => weakMapRafCleanup(key);

export const useRaf = hasWeakSet ? weakMapUseRaf : mapUseRaf;
