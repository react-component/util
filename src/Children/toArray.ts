import React from 'react';
import { isFragment } from 'react-is';

export default function toArray(
  children: React.ReactNode,
): React.ReactElement[] {
  let ret: React.ReactElement[] = [];

  React.Children.forEach(children, (child: any) => {
    if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children));
    } else {
      ret.push(child);
    }
  });

  return ret;
}
