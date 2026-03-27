/**
 * Merges multiple props objects into one. Unlike `Object.assign()` or `{ ...a, ...b }`, it skips
 * properties whose value is explicitly set to `undefined`.
 *
 * @example
 * ```ts
 * const { a, b } = mergeProps(defaults, config, props);
 * ```
 */
function mergeProps<A, B>(a: A, b: B): B & A;
function mergeProps<A, B, C>(a: A, b: B, c: C): C & B & A;
function mergeProps<A, B, C, D>(a: A, b: B, c: C, d: D): D & C & B & A;
function mergeProps(...items: any[]) {
  const ret: any = {};
  for (const item of items) {
    if (item) {
      for (const key of Object.keys(item)) {
        if (item[key] !== undefined) {
          if (key === 'className') {
            ret[key] = `${ret[key] || ''} ${item[key] || ''}`.trim();
          } else if (key === 'style') {
            ret[key] = { ...ret[key], ...item[key] };
          } else {
            ret[key] = item[key];
          }
        }
      }
    }
  }
  return ret;
}

export default mergeProps;
