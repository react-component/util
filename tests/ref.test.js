import React from 'react';
import { mount } from 'enzyme';
import { composeRef, supportRef } from '../src/ref';

describe('ref', () => {
  it('composeRef', () => {
    const refFunc1 = jest.fn();
    const refFunc2 = jest.fn();

    const mergedRef = composeRef(refFunc1, refFunc2);
    const testRefObj = {};
    mergedRef(testRefObj);
    expect(refFunc1).toHaveBeenCalledWith(testRefObj);
    expect(refFunc2).toHaveBeenCalledWith(testRefObj);
  });

  describe('supportRef', () => {
    it('function component', () => {
      const FC = () => <div />;
      const wrapper = mount(
        <div>
          <FC />
        </div>,
      );
      expect(supportRef(FC)).toBeFalsy();
      expect(supportRef(wrapper.props().children)).toBeFalsy();
    });

    it('forwardRef function component', () => {
      const FRC = React.forwardRef(() => <div />);
      const wrapper = mount(
        <div>
          <FRC />
        </div>,
      );
      expect(supportRef(FRC)).toBeTruthy();
      expect(supportRef(wrapper.props().children)).toBeTruthy();
    });

    it('class component', () => {
      class CC extends React.Component {
        state = {};

        render() {
          return null;
        }
      }
      const wrapper = mount(
        <div>
          <CC />
        </div>,
      );
      expect(supportRef(CC)).toBeTruthy();
      expect(supportRef(wrapper.props().children)).toBeTruthy();
    });
  });
});
