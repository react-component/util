import warning from './warning';

/**
 * Deeply compares two object literals.
 * @param obj1 object 1
 * @param obj2 object 2
 * @param shallow shallow compare
 * @returns
 */
function isEqual(obj1: any, obj2: any, shallow = false): boolean {
  // https://github.com/mapbox/mapbox-gl-js/pull/5979/files#diff-fde7145050c47cc3a306856efd5f9c3016e86e859de9afbd02c879be5067e58f
  // The ANCESTORS of the value being compared, not every value seen so far: a cycle is a value
  // reachable from itself, while the same reference met again in a sibling branch is a repeat and
  // has to compare normally. Entries are released as the walk unwinds, below.
  const refSet = new Set<any>();
  function deepEqual(a: any, b: any, level = 1): boolean {
    const circular = refSet.has(a);
    warning(!circular, 'Warning: There may be circular references');
    if (circular) {
      return false;
    }
    if (a === b) {
      return true;
    }
    if (shallow && level > 1) {
      return false;
    }
    refSet.add(a);
    const newLevel = level + 1;
    try {
      if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (!deepEqual(a[i], b[i], newLevel)) {
            return false;
          }
        }
        return true;
      }
      if (a && b && typeof a === 'object' && typeof b === 'object') {
        const keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
          return false;
        }
        return keys.every(key => deepEqual(a[key], b[key], newLevel));
      }
      // other
      return false;
    } finally {
      // The walk has left this branch, so `a` is no longer an ancestor of what comes next.
      refSet.delete(a);
    }
  }

  return deepEqual(obj1, obj2);
}

export default isEqual;
