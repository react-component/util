import get from './get';

export type Path = (string | number | symbol)[];

function internalSet<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: Path,
  value: Value,
  removeIfUndefined: boolean,
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

  // Delete prop if `removeIfUndefined` and value is undefined
  if (removeIfUndefined && value === undefined && restPath.length === 1) {
    delete clone[path][restPath[0]];
  } else {
    clone[path] = internalSet(clone[path], restPath, value, removeIfUndefined);
  }

  return clone;
}

export default function set<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: Path,
  value: Value,
  removeIfUndefined: boolean = false,
): Output {
  // Do nothing if `removeIfUndefined` and parent object not exist
  if (
    paths.length &&
    removeIfUndefined &&
    value === undefined &&
    !get(entity, paths.slice(0, -1))
  ) {
    return (entity as unknown) as Output;
  }

  return internalSet(entity, paths, value, removeIfUndefined);
}

function isObject(obj: any) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
}

function createEmpty<T>(source: T) {
  return (Array.isArray(source) ? [] : {}) as T;
}

const keys = typeof Reflect === 'undefined' ? Object.keys : Reflect.ownKeys;

/**
 * Merge objects which will create
 */
export function merge<T extends object>(...sources: T[]) {
  let clone = createEmpty(sources[0]);

  sources.forEach(src => {
    function internalMerge(path: Path, parentLoopSet?: Set<object>) {
      const loopSet = new Set(parentLoopSet);

      const value = get(src, path);

      const isArr = Array.isArray(value);

      if (isArr || isObject(value)) {
        // Only add not loop obj
        if (!loopSet.has(value)) {
          loopSet.add(value);

          const originValue = get(clone, path);

          if (isArr) {
            // Array will always be override
            clone = set(clone, path, []);
          } else if (!originValue || typeof originValue !== 'object') {
            // Init container if not exist
            clone = set(clone, path, createEmpty(value));
          }

          keys(value).forEach(key => {
            internalMerge([...path, key], loopSet);
          });
        }
      } else {
        clone = set(clone, path, value);
      }
    }

    internalMerge([]);
  });

  return clone;
}
