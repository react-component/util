import React from 'react';
import { render } from '@testing-library/react';
import toArray from '../src/Children/toArray';

describe('toArray', () => {
  class UL extends React.Component {
    render() {
      return <ul>{this.props.children}</ul>;
    }
  }

  it('basic', () => {
    const ulRef = React.createRef();

    render(
      <UL ref={ulRef}>
        <li key="1">1</li>
        <li key="2">2</li>
        <li key="3">3</li>
      </UL>,
    );

    const children = toArray(ulRef.current.props.children);
    expect(children).toHaveLength(3);
    expect(children.map(c => c.key)).toEqual(['1', '2', '3']);
  });

  it('Array', () => {
    const ulRef = React.createRef();

    render(
      <UL ref={ulRef}>
        <li key="1">1</li>
        {[<li key="2">2</li>, <li key="3">3</li>]}
      </UL>,
    );

    const children = toArray(ulRef.current.props.children);
    expect(children).toHaveLength(3);
    expect(children.map(c => c.key)).toEqual(['1', '2', '3']);
  });

  it('Fragment', () => {
    const ulRef = React.createRef();

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

  it('keep empty', () => {
    const ulRef = React.createRef();

    render(
      <UL ref={ulRef}>
        {null}
        <li key="1">1</li>
        <>
          <li key="2">2</li>
          {null}
          <li key="3">3</li>
        </>
        <React.Fragment>
          <>
            <li key="4">4</li>
            {undefined}
            <li key="5">5</li>
          </>
        </React.Fragment>
        {undefined}
      </UL>,
    );

    const children = toArray(ulRef.current.props.children, { keepEmpty: true });
    expect(children).toHaveLength(9);
    expect(children.map(c => c && c.key)).toEqual([
      null,
      '1',
      '2',
      null,
      '3',
      '4',
      null,
      '5',
      null,
    ]);
  });
});
