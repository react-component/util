/* eslint-disable no-eval */
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import useEvent from '../src/hooks/useEvent';
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
      render(<Demo ref1={ref1} ref2={ref2} />);

      expect(ref1.current).toBeTruthy();
      expect(ref1.current).toBe(ref2.current);
    });

    it('useComposeRef not changed', () => {
      let count = 0;

      const Demo = () => {
        const [, forceUpdate] = React.useState({});

        const ref1 = React.useRef();
        const ref2 = React.useRef();
        const refFn = useEvent(() => {
          count += 1;
        });
        const mergedRef = useComposeRef(ref1, ref2, refFn);
        return (
          <button ref={mergedRef} onClick={() => forceUpdate({})}>
            Update
          </button>
        );
      };

      const { container, unmount } = render(<Demo />);
      expect(count).toEqual(1);

      for (let i = 0; i < 10; i += 1) {
        fireEvent.click(container.querySelector('button'));
        expect(count).toEqual(1);
      }

      unmount();
      expect(count).toEqual(2);
    });
  });

  describe('supportRef', () => {
    class Holder extends React.Component {
      render() {
        return this.props.children;
      }
    }

    it('function component', () => {
      const holderRef = React.createRef();

      function FC() {
        return <div />;
      }

      render(
        <Holder ref={holderRef}>
          <FC />
        </Holder>,
      );
      expect(supportRef(FC)).toBeFalsy();
      expect(supportRef(holderRef.current.props.children)).toBeFalsy();
    });

    it('arrow function component', () => {
      const holderRef = React.createRef();

      // Use eval since jest will convert arrow function to function
      const FC = eval('() => null');
      render(
        <Holder ref={holderRef}>
          <FC />
        </Holder>,
      );
      expect(supportRef(FC)).toBeFalsy();
      expect(supportRef(holderRef.current.props.children)).toBeFalsy();
    });

    it('forwardRef function component', () => {
      const holderRef = React.createRef();

      const FRC = React.forwardRef(() => <div />);
      render(
        <Holder ref={holderRef}>
          <FRC />
        </Holder>,
      );
      expect(supportRef(FRC)).toBeTruthy();
      expect(supportRef(holderRef.current.props.children)).toBeTruthy();
    });

    it('class component', () => {
      const holderRef = React.createRef();

      class CC extends React.Component {
        state = {};

        render() {
          return null;
        }
      }
      render(
        <Holder ref={holderRef}>
          <CC />
        </Holder>,
      );
      expect(supportRef(CC)).toBeTruthy();
      expect(supportRef(holderRef.current.props.children)).toBeTruthy();
    });

    it('memo of function component', () => {
      const holderRef = React.createRef();

      const FC = () => <div />;
      const MemoFC = React.memo(FC);
      render(
        <Holder ref={holderRef}>
          <MemoFC />
        </Holder>,
      );
      expect(supportRef(MemoFC)).toBeFalsy();
      expect(supportRef(holderRef.current.props.children)).toBeFalsy();
    });

    it('memo of forwardRef function component', () => {
      const holderRef = React.createRef();

      const FRC = React.forwardRef(() => <div />);
      const MemoFC = React.memo(FRC);
      render(
        <Holder ref={holderRef}>
          <MemoFC />
        </Holder>,
      );
      expect(supportRef(MemoFC)).toBeTruthy();
      expect(supportRef(holderRef.current.props.children)).toBeTruthy();
    });
  });
});
