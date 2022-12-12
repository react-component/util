function omit<T extends object, K extends keyof T>(
  obj: T,
  ...fields: (K | readonly K[])[]
): Omit<T, K>;

function omit<T extends object, K extends PropertyKey[]>(
  obj: T,
  ...fields: K
): Partial<T> {
  const clone = { ...obj };
  if (Array.isArray(fields)) {
    fields.forEach(key => {
      delete clone[key as keyof T];
    });
  }
  return clone;
}

export default omit;
