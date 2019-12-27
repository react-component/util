export default function set<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
): Output {
  if (!paths.length) {
    return (value as unknown) as Output;
  }

  const [path, ...restPath] = paths;

  let clone: Output;
  if (!entity && typeof path === 'number') {
    clone = ([] as unknown) as Output;
  } else if (Array.isArray(entity)) {
    clone = ([...entity] as unknown) as Output;
  } else {
    clone = ({ ...entity } as unknown) as Output;
  }

  clone[path] = set(clone[path], restPath, value);

  return clone;
}
