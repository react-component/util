import React from 'react';
import { render } from '@testing-library/react';
import toArray from '../src/Children/toArray';

class UL extends React.Component<React.PropsWithChildren<any>> {
  render() {
    return <ul>{this.props.children}</ul>;
  }
}

describe('toArray', () => {
  it('Fragment', () => {
    const ulRef = React.createRef<UL>();

    render(
      <UL ref={ulRef}>
        <li key="1">1</li>
        <>
          <li key="2">2</li>
          <li key="3">3</li>
        </>
        <React.Fragment>
          <>
            <li key="4">4</li>
            <li key="5">5</li>
          </>
        </React.Fragment>
      </UL>,
    );

    const children = toArray(ulRef.current.props.children);
    expect(children).toHaveLength(5);
    expect(children.map(c => c.key)).toEqual(['1', '2', '3', '4', '5']);
  });
});
