import React from 'react';
import { render } from '@testing-library/react';
import Portal from '../src/React/Portal';

describe('Portal', () => {
  it('Order', () => {
    render(
      <Portal open>
        <p>Root</p>
        <Portal open>
          <p>Parent</p>
          <Portal open>
            <p>Children</p>
          </Portal>
        </Portal>
      </Portal>,
    );

    const pList = Array.from(document.body.querySelectorAll('p'));
    expect(pList).toHaveLength(3);
    expect(pList.map(p => p.textContent)).toEqual([
      'Root',
      'Parent',
      'Children',
    ]);
  });
});
