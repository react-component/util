import React from 'react';

export default function toArray(children: React.ReactNode): React.ReactElement[] {
  const ret = [];
  React.Children.forEach(children, c => {
    ret.push(c);
  });
  return ret;
}
