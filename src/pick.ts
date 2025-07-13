const pick = <T extends object, K extends keyof T>(
  obj: T,
  fields: K[] | readonly K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;

  if (Array.isArray(fields)) {
    for (const key of fields) {
      result[key] = obj[key];
    }
  }

  return result;
};

export default pick;
