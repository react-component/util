export default function set<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
): Output {
  if (!paths.length) {
    return (value as unknown) as Output;
  }

  const clone = ((Array.isArray(entity)
    ? [...entity]
    : { ...entity }) as unknown) as Output;

  const [path, ...restPath] = paths;
  clone[path] = set(clone[path], restPath, value);

  return clone;
}
