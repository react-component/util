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
const rafIds = new Map<number, number>();
const rafKeys = new WeakSet<number[]>();

const cleanupByMap = (id: number) => rafIds.delete(id);

const useRafByMap = (callback: () => void, times = 1): number => {
  rafUUID += 1;
  const id = rafUUID;

  function callRef(leftTimes: number) {
    if (leftTimes === 0) {
      // Clean up
      cleanupByMap(id);

      // Trigger
      callback();
    } else {
      // Next raf
      const realId = raf(() => {
        callRef(leftTimes - 1);
      });

      // Bind real raf id
      rafIds.set(id, realId);
    }
  }

  callRef(times);

  return id;
};

useRafByMap.cancel = (key: number) => {
  const realId = rafIds.get(key);
  cleanupByMap(key);
  return caf(realId);
};

const cleanupByWeakSet = (key: number[] | number) => {
  let oldKey = typeof key === "number" ? [+key] : key;
  const [timeId] = oldKey || [];
  if (timeId) {
    caf(timeId);
    rafKeys.delete(oldKey);
    const bool = !!rafKeys.has(oldKey);
    oldKey = null;
    return bool;
  } else {
    return false;
  }
};

const useRafByWeakSet = (callback: () => void, times = 1): number => {
  let key: number[];

  function callRef(leftTimes: number) {
    if (leftTimes === 0) {
      // Clean up
      cleanupByWeakSet(key);

      // Trigger
      callback();
    } else {
      // Next raf
      key = [
        raf(() => {
          callRef(leftTimes - 1);
        }),
      ];

      // Bind real raf id
      rafKeys.add(key);
    }
  }

  callRef(times);

  return +key;
};

useRafByWeakSet.cancel = (key: number[]) => cleanupByWeakSet(key);

export const useRaf = hasWeakSet ? useRafByWeakSet : useRafByMap;
