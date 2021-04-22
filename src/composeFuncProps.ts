function composeFuncProps<T = Record<string, any>>(
  itemProps: T,
  childrenProps: Partial<T>,
) {
  const composeProps = { ...itemProps, ...childrenProps };
  Object.keys(composeProps).forEach(key => {
    if (typeof composeProps[key] === 'function') {
      composeProps[key] = (...args: any[]) => {
        itemProps[key]?.(...args);
        childrenProps[key]?.(...args);
      };
    }
  });
  return composeProps;
}

export default composeFuncProps;
