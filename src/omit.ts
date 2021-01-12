export default function omit<T extends object, K extends keyof T>(
  obj: T,
  fields: K[],
): Omit<T, K> {
  const clone = { ...obj };

  fields.forEach(key => {
    delete clone[key];
  });

  return clone;
}
