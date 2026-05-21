/**
 * Proxy object if environment supported
 */
export default function proxyObject<
  Obj extends object,
  ExtendObj extends object,
>(obj: Obj, extendProps: ExtendObj): Obj & ExtendObj {
  if (typeof Proxy !== 'undefined' && obj) {
    return new Proxy(obj, {
      get(target, prop) {
        if (extendProps[prop]) {
          return extendProps[prop];
        }

        // Proxy origin property
        const originProp = (target as any)[prop];
        return typeof originProp === 'function'
          ? originProp.bind(target)
          : originProp;
      },
      set(target, prop, v) {
        let value = v;
        if (typeof prop === 'string' && ['value'].includes(prop)) {
          if (typeof value !== 'string') {
            value = '' + value;
          }
          target[prop] = value;
          return true;
        }
      },
    }) as Obj & ExtendObj;
  }

  return obj as Obj & ExtendObj;
}
