function composeFuncProps<T = any>(object: Partial<T>, source: T) {
  const composeProps = {};
  Object.keys(object).forEach(key => {
    if (typeof object[key] === 'function') {
      composeProps[key] = (...args: any[]) => {
        object[key]?.(...args);
        source[key]?.(...args);
      };
    }
  });
  return { ...object, ...source, ...composeProps };
}

export default composeFuncProps;
