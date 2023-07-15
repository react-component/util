export default function get(
  entity: any,
  path: (string | number | symbol)[] | readonly (string | number | symbol)[],
) {
  let current = entity;

  for (let i = 0; i < path.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = current[path[i]];
  }

  return current;
}
