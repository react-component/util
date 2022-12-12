function omit<T extends object, K extends PropertyKey[]>(
  obj: T | null | undefined,
  ...fields: (K | readonly K[])[]
): Pick<T, Exclude<keyof T, K[number]>>;

function omit<T extends object, K extends keyof T>(
  obj: T | null | undefined,
  ...fields: K[]
): Omit<T, K>;

function omit<T extends object>(
  obj: T | null | undefined,
  ...fields: (PropertyKey | readonly PropertyKey[])[]
): Partial<T> {
  const clone = { ...obj };
  if (Array.isArray(fields)) {
    fields.forEach((key: PropertyKey) => {
      delete clone[key];
    });
  }
  return clone;
}

export default omit;
