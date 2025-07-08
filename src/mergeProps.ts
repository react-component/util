import classNames from 'classnames';
import { isPlainObject } from 'is-plain-object';
import { isValidElement } from 'react';

function mergeClassNames<T>(classNamesA: T, classNamesB: T): T {
  const result = { ...classNamesA };
  Object.keys(classNamesB).forEach(key => {
    result[key] = mergeClassName(classNamesA[key], classNamesB[key]);
  });
  return result;
}

function mergeClassName(classNameA?: any, classNameB?: any): string {
  if (typeof classNameA === 'object' || typeof classNameB === 'object') {
    return mergeClassNames(classNameA, classNameB);
  }

  return classNames(classNameA, classNameB);
}

export default function mergeProps<T>(...list: T[]): T {
  if (list.length > 2) {
    return mergeProps(list[0], mergeProps(...list.slice(1)));
  }
  const result: T = { ...list[0] };
  list[1] &&
    Object.keys(list[1]).forEach(key => {
      if (key === 'className') {
        result[key] = classNames(result[key], list[1][key]);
      } else if (key === 'classNames') {
        result[key] = mergeClassNames(result[key], list[1][key]);
      } else if (isPlainObject(list[1][key]) && !isValidElement(list[1][key])) {
        result[key] = mergeProps(result[key], list[1][key]);
      } else {
        result[key] = list[1][key] ?? result[key];
      }
    });
  return result;
}
