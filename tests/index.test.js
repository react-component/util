import React from 'react';
import ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';

import createChainedFunction from '../src/createChainedFunction';
import PureRenderMixin from '../src/PureRenderMixin';

describe('rc-util', () => {
  it('createChainedFunction works', () => {
    const ret = [];

    function f1() {
      ret.push(1);
    }

    function f2() {
      ret.push(2);
    }

    function f3() {
      ret.push(3);
    }

    createChainedFunction(f1, f2, f3, null)();
    expect(ret).toEqual([1, 2, 3]);
  });

  it('PureRenderMixin works', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    let count = 0;
    const C = createReactClass({ // eslint-disable-line
      mixins: [PureRenderMixin],
      getInitialState() {
        return {
          a: 1,
        };
      },
      render() {
        count++;
        return <span>{this.state.a}</span>; // eslint-disable-line
      },
    });
    const c = ReactDOM.render(<C />, div); // eslint-disable-line
    c.setState({
      a: 1,
    });
    expect(count).toBe(1);
  });
});
