function composeProps<T extends Record<string, any>>(
  originProps: T,
  patchProps: Partial<T>,
  isAll?: boolean,
) {
  const composedProps: Record<string, any> = {
    ...originProps,
    ...(isAll ? patchProps : {}),
  };

  Object.keys(patchProps).forEach(key => {
    const func = patchProps[key];
    if (typeof func === 'function') {
      composedProps[key] = (...args: any[]) => {
        func(...args);
        return originProps[key]?.(...args);
      };
    }
  });
  return composedProps as T;
}

export default composeProps;
