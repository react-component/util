/**
 * Deeply compares two object literals.
 */
function isEqual(obj1: any, obj2: any): boolean {
  // https://github.com/mapbox/mapbox-gl-js/pull/5979/files#diff-fde7145050c47cc3a306856efd5f9c3016e86e859de9afbd02c879be5067e58f
  const refSet = new Set<any>();
  function deepEqual(a: any, b: any): boolean {
    if (refSet.has(a)) {
      throw new Error('There may be circular references');
    }
    if (a === b) {
      return true;
    }
    refSet.add(a);
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    if (typeof a === 'object' && a !== null && b !== null) {
      if (!(typeof b === 'object')) {
        return false;
      }
      const keys = Object.keys(a);
      if (keys.length !== Object.keys(b).length) {
        return false;
      }
      for (const key in a) {
        if (!deepEqual(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
    // other
    return false;
  }

  const equal = deepEqual(obj1, obj2);
  refSet.clear();
  return equal;
}

export default isEqual;
