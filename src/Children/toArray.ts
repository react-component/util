import React from 'react';

function isFragment(node: React.ReactNode): boolean {
  return node && (node as React.ReactElement).type === React.Fragment;
}

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
