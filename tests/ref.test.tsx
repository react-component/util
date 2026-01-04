/* eslint-disable no-eval */
import { fireEvent, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import React from 'react';
import useEvent from '../src/hooks/useEvent';
import {
  composeRef,
  getNodeRef,
  supportNodeRef,
  supportRef,
  useComposeRef,
} from '../src/ref';

describe('ref', () => {
  const errSpy = jest.spyOn(console, 'error');

  beforeEach(() => {
    errSpy.mockReset();
  });

  describe('composeRef', () => {
    it('basic', () => {
      const refFunc1 = jest.fn();
      const refFunc2 = jest.fn();

      const mergedRef = composeRef(refFunc1, refFunc2);
      const testRefObj = {};
      (mergedRef as any)(testRefObj);
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
        const mergedRef = useComposeRef<HTMLDivElement>(ref1, ref2);
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

      const Demo: React.FC = () => {
        const [, forceUpdate] = React.useState({});

        const ref1 = React.useRef<HTMLButtonElement>(null);
        const ref2 = React.useRef<HTMLButtonElement>(null);

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
    class Holder extends React.Component<{ children: ReactNode }> {
      render() {
        return this.props.children;
      }
    }

    it('function component1', () => {
      const holderRef = React.createRef<Holder>();

      function FC() {
        return <div />;
      }

      render(
        <Holder ref={holderRef}>
          <FC />
        </Holder>,
      );
      expect(supportRef(FC)).toBeFalsy();
      // expect(supportRef(holderRef.current.props.children)).toBeFalsy();
    });

    it('arrow function component', () => {
      const holderRef = React.createRef<Holder>();

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
      const holderRef = React.createRef<Holder>();

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
      const holderRef = React.createRef<Holder>();

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
      const holderRef = React.createRef<Holder>();

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
      const holderRef = React.createRef<Holder>();

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

    it('skip null', () => {
      expect(supportRef(null)).toBeFalsy();
    });
  });

  describe('nodeSupportRef', () => {
    it('invalid element but valid ReactNode', () => {
      expect(supportNodeRef(true)).toBeFalsy();
      expect(supportNodeRef('div')).toBeFalsy();
      expect(supportNodeRef(123)).toBeFalsy();
      expect(supportNodeRef(<></>)).toBeFalsy();
    });

    it('FC', () => {
      const FC = () => <div />;
      const RefFC = React.forwardRef(FC);
      expect(supportNodeRef(<FC />)).toBeFalsy();
      expect(supportNodeRef(<RefFC />)).toBeTruthy();
    });

    it('ref', () => {
      const FC: React.FC = () => <div />;
      const RefFC = React.forwardRef<
        HTMLDivElement,
        React.HTMLAttributes<HTMLDivElement>
      >((props, ref) => <div {...props} ref={ref} />);
      const com = <FC />;
      const refCom = <RefFC ref={React.createRef()} />;
      expect(supportNodeRef(com) && com.ref).toBeFalsy();
      expect(supportNodeRef(refCom) && refCom.ref).toBeTruthy();
    });
  });

  it('getNodeRef', () => {
    const ref = React.createRef<HTMLDivElement>();
    const node = <div ref={ref} />;

    expect(getNodeRef(node)).toBe(ref);

    expect(errSpy).not.toHaveBeenCalled();
  });
});
