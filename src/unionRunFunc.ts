const unionRunFunc = (
  itemProps: Record<string, any>,
  childrenProps: Record<string, any>,
) => {
  const _props = { ...itemProps, ...childrenProps };
  Object.keys(_props).forEach(key => {
    if (typeof _props[key] === 'function') {
      _props[key] = (...args: any[]) => {
        itemProps[key]?.(...args);
        childrenProps[key]?.(...args);
      };
    }
  });
  return _props;
};

export default unionRunFunc;
