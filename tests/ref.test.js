/* eslint-disable no-eval */
import React from 'react';
import { mount } from 'enzyme';
import { composeRef, supportRef, useComposeRef } from '../src/ref';

describe('ref', () => {
  describe('composeRef', () => {
    it('basic', () => {
      const refFunc1 = jest.fn();
      const refFunc2 = jest.fn();

      const mergedRef = composeRef(refFunc1, refFunc2);
      const testRefObj = {};
      mergedRef(testRefObj);
      expect(refFunc1).toHaveBeenCalledWith(testRefObj);
      expect(refFunc2).toHaveBeenCalledWith(testRefObj);
    });

    it('ignore empty', () => {
      const ref = React.createRef();
      expect(composeRef(undefined, ref, null)).toBe(ref);
      expect(composeRef(undefined, null)).toBeFalsy();
    });

    it('useComposeRef', () => {
      const Demo = ({ ref1, ref2 }) => {
        const mergedRef = useComposeRef(ref1, ref2);
        return <div ref={mergedRef} />;
      };

      const ref1 = React.createRef();
      const ref2 = React.createRef();
      mount(<Demo ref1={ref1} ref2={ref2} />);

      expect(ref1.current).toBeTruthy();
      expect(ref1.current).toBe(ref2.current);
    });
  });

  describe('supportRef', () => {
    it('function component', () => {
      function FC() {
        return <div />;
      }
      const wrapper = mount(
        <div>
          <FC />
        </div>,
      );
      expect(supportRef(FC)).toBeFalsy();
      expect(supportRef(wrapper.props().children)).toBeFalsy();
    });

    it('arrow function component', () => {
      // Use eval since jest will convert arrow function to function
      const FC = eval('() => null');
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

    it('memo of function component', () => {
      const FC = () => <div />;
      const MemoFC = React.memo(FC);
      const wrapper = mount(
        <div>
          <MemoFC />
        </div>,
      );
      expect(supportRef(MemoFC)).toBeFalsy();
      expect(supportRef(wrapper.props().children)).toBeFalsy();
    });

    it('memo of forwardRef function component', () => {
      const FRC = React.forwardRef(() => <div />);
      const MemoFC = React.memo(FRC);
      const wrapper = mount(
        <div>
          <MemoFC />
        </div>,
      );
      expect(supportRef(MemoFC)).toBeTruthy();
      expect(supportRef(wrapper.props().children)).toBeTruthy();
    });
  });
});
