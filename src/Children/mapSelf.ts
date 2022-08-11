import React from 'react';

function mirror<T = any>(o: T): T {
  return o;
}

export default function mapSelf<C>(children: C | ReadonlyArray<C>) {
  // return ReactFragment
  return React.Children.map(children, mirror);
}
