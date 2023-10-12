import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import useId from '../src/hooks/useId';
import useLayoutEffect from '../src/hooks/useLayoutEffect';
import useMemo from '../src/hooks/useMemo';
import useMergedState from '../src/hooks/useMergedState';
import useMobile from '../src/hooks/useMobile';
import useState from '../src/hooks/useState';

global.disableUseId = false;

jest.mock('react', () => {
  const react = jest.requireActual('react');

  const clone = { ...react };

  Object.defineProperty(clone, 'useId', {
    get: () => (global.disableUseId ? undefined : react.useId),
  });

  return clone;
});

describe('hooks', () => {
  it('useMemo', () => {
    const FC = ({ open, data }) => {
      const memoData = useMemo(
        () => data,
        [open, data],
        (prev, next) => next[0] && prev[1] !== next[1],
      );
      return <div>{memoData}</div>;
    };

    const { container, rerender } = render(<FC data="open" open />);
    expect(container.querySelector('div').textContent).toEqual('open');

    rerender(<FC data="again" open />);
    expect(container.querySelector('div').textContent).toEqual('again');

    rerender(<FC data="close" open={false} />);
    expect(container.querySelector('div').textContent).toEqual('again');

    rerender(<FC data="repeat" open />);
    expect(container.querySelector('div').textContent).toEqual('repeat');
  });

  describe('useMergedState', () => {
    const FC = ({ value, defaultValue }) => {
      const [val, setVal] = useMergedState(null, { value, defaultValue });
      return (
        <>
          <input
            value={val}
            onChange={e => {
              setVal(e.target.value);
            }}
          />
          <span className="txt">{val}</span>
        </>
      );
    };

    it('still control of to undefined', () => {
      const { container, rerender } = render(<FC value="test" />);

      expect(container.querySelector('input').value).toEqual('test');
      expect(container.querySelector('.txt').textContent).toEqual('test');

      rerender(<FC value={undefined} />);
      expect(container.querySelector('input').value).toEqual('test');
      expect(container.querySelector('.txt').textContent).toEqual('');
    });

    describe('correct defaultValue', () => {
      it('raw', () => {
        const { container } = render(<FC defaultValue="test" />);

        expect(container.querySelector('input').value).toEqual('test');
      });

      it('func', () => {
        const { container } = render(<FC defaultValue={() => 'bamboo'} />);

        expect(container.querySelector('input').value).toEqual('bamboo');
      });
    });

    it('not rerender when setState as deps', () => {
      let renderTimes = 0;

      const Test = () => {
        const [val, setVal] = useMergedState(0);

        React.useEffect(() => {
          renderTimes += 1;
          expect(renderTimes < 10).toBeTruthy();

          setVal(1);
        }, [setVal]);

        return <div>{val}</div>;
      };

      const { container } = render(<Test />);
      expect(container.firstChild.textContent).toEqual('1');
    });

    it('React 18 should not reset to undefined', () => {
      const Demo = () => {
        const [val] = useMergedState(33, { value: undefined });

        return <div>{val}</div>;
      };

      const { container } = render(
        <React.StrictMode>
          <Demo />
        </React.StrictMode>,
      );

      expect(container.querySelector('div').textContent).toEqual('33');
    });

    it('postState', () => {
      const Demo = () => {
        const [val] = useMergedState(1, { postState: v => v * 2 });

        return <div>{val}</div>;
      };

      const { container } = render(
        <React.StrictMode>
          <Demo />
        </React.StrictMode>,
      );

      expect(container.querySelector('div').textContent).toEqual('2');
    });

    describe('not trigger onChange if props change', () => {
      function test(name, postWrapper = node => node) {
        it(name, () => {
          const Demo = ({ value, onChange }) => {
            const [mergedValue, setValue] = useMergedState(0, {
              onChange,
            });

            return (
              <>
                <button
                  onClick={() => {
                    setValue(v => v + 1);
                  }}
                >
                  {mergedValue}
                </button>
                <a
                  onClick={() => {
                    setValue(v => v + 1);
                    setValue(v => v + 1);
                  }}
                />
              </>
            );
          };

          const onChange = jest.fn();
          const { container } = render(
            postWrapper(<Demo onChange={onChange} />),
          );

          expect(container.querySelector('button').textContent).toEqual('0');
          expect(onChange).not.toHaveBeenCalled();

          // Click to change
          fireEvent.click(container.querySelector('button'));
          expect(container.querySelector('button').textContent).toEqual('1');
          expect(onChange).toHaveBeenCalledWith(1, 0);
          onChange.mockReset();

          // Click to change twice in same time so should not trigger onChange twice
          fireEvent.click(container.querySelector('a'));
          expect(container.querySelector('button').textContent).toEqual('3');
          expect(onChange).toHaveBeenCalledWith(3, 1);
          onChange.mockReset();
        });
      }

      test('raw');
      test('strict', node => <React.StrictMode>{node}</React.StrictMode>);
    });

    it('uncontrolled to controlled', () => {
      const onChange = jest.fn();

      const Demo = ({ value }) => {
        const [mergedValue, setMergedValue] = useMergedState(() => 233, {
          value,
          onChange,
        });

        return (
          <span
            onClick={() => {
              setMergedValue(v => v + 1);
              setMergedValue(v => v + 1);
            }}
            onMouseEnter={() => {
              setMergedValue(1);
            }}
          >
            {mergedValue}
          </span>
        );
      };

      const { container, rerender } = render(<Demo />);
      expect(container.textContent).toEqual('233');
      expect(onChange).not.toHaveBeenCalled();

      // Update value
      rerender(<Demo value={1} />);
      expect(container.textContent).toEqual('1');
      expect(onChange).not.toHaveBeenCalled();

      // Click update
      rerender(<Demo value={undefined} />);
      fireEvent.mouseEnter(container.querySelector('span'));
      fireEvent.click(container.querySelector('span'));
      expect(container.textContent).toEqual('3');
      expect(onChange).toHaveBeenCalledWith(3, 1);
    });

    it('not trigger onChange if set same value', () => {
      const onChange = jest.fn();

      const Test = ({ value }) => {
        const [mergedValue, setMergedValue] = useMergedState(undefined, {
          value,
          onChange,
        });
        return (
          <span
            onClick={() => {
              setMergedValue(1);
            }}
            onMouseEnter={() => {
              setMergedValue(2);
            }}
          >
            {mergedValue}
          </span>
        );
      };

      const { container } = render(<Test value={1} />);
      fireEvent.click(container.querySelector('span'));
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.mouseEnter(container.querySelector('span'));
      expect(onChange).toHaveBeenCalledWith(2, 1);
    });

    it('should alway use option value', () => {
      const onChange = jest.fn();

      const Test = ({ value }) => {
        const [mergedValue, setMergedValue] = useMergedState(undefined, {
          value,
          onChange,
        });
        return (
          <span
            onClick={() => {
              setMergedValue(12);
            }}
          >
            {mergedValue}
          </span>
        );
      };

      const { container } = render(<Test value={1} />);
      fireEvent.click(container.querySelector('span'));

      expect(container.textContent).toBe('1');
    });

    it('render once', () => {
      let count = 0;

      const Demo = () => {
        const [] = useMergedState();
        count += 1;
        return null;
      };

      render(<Demo />);
      expect(count).toBe(1);
    });
  });

  describe('useLayoutEffect', () => {
    const FC = ({ defaultValue }) => {
      const [val, setVal] = React.useState(defaultValue);
      const [val2, setVal2] = React.useState();
      useLayoutEffect(() => {
        setVal2(`${val}a`);
      }, [val]);
      return (
        <div>
          <input
            value={val}
            onChange={e => {
              setVal(e.target.value);
            }}
          />
          <label>{val2}</label>
        </div>
      );
    };

    it('correct effect', () => {
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { container } = render(<FC defaultValue="test" />);
      expect(container.querySelector('label').textContent).toEqual('testa');

      fireEvent.change(container.querySelector('input'), {
        target: { value: '1' },
      });
      expect(container.querySelector('label').textContent).toEqual('1a');

      fireEvent.change(container.querySelector('input'), {
        target: { value: '2' },
      });
      expect(container.querySelector('label').textContent).toEqual('2a');

      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('can get mount state', () => {
      const Demo = () => {
        const timesRef = React.useRef(0);
        const [, forceUpdate] = React.useState(0);

        useLayoutEffect(firstMount => {
          if (timesRef.current === 0) {
            expect(firstMount).toBeTruthy();
            forceUpdate(1);
          } else {
            expect(firstMount).toBeFalsy();
            forceUpdate(2);
          }

          timesRef.current += 1;
        });

        return <p>{timesRef.current}</p>;
      };

      const { container } = render(<Demo />);
      expect(container.querySelector('p').textContent).toEqual('2');
    });
  });

  describe('useState', () => {
    it('not throw', done => {
      const errorSpy = jest.spyOn(console, 'error');

      const Demo = () => {
        const [val, setValue] = useState(0);

        React.useEffect(
          () => () => {
            setTimeout(() => {
              setValue(1, true);
            }, 0);
          },
          [],
        );

        return (
          <button
            onClick={() => {
              setValue(93, true);
            }}
          >
            {val}
          </button>
        );
      };

      const { container, unmount } = render(
        <React.StrictMode>
          <Demo />
        </React.StrictMode>,
      );
      expect(container.querySelector('button').textContent).toEqual('0');

      // Update Value
      fireEvent.click(container.querySelector('button'));
      expect(container.querySelector('button').textContent).toEqual('93');

      unmount();

      setTimeout(() => {
        expect(errorSpy).not.toHaveBeenCalled();
        done();
      }, 50);
    });

    // This test no need in React 18 anymore
    it.skip('throw', done => {
      const errorSpy = jest.spyOn(console, 'error');

      const Demo = () => {
        const [val, setValue] = useState(0);

        React.useEffect(
          () => () => {
            setTimeout(() => {
              setValue(1);
            }, 0);
          },
          [],
        );

        return null;
      };

      const { unmount } = render(<Demo />);
      unmount();

      setTimeout(() => {
        expect(errorSpy).toHaveBeenCalled();
        done();
      }, 50);
    });
  });

  describe('useId', () => {
    const Demo = ({ id } = {}) => {
      const mergedId = useId(id);
      return <div id={mergedId} className="target" />;
    };

    function matchId(container, id) {
      const ele = container.querySelector('.target');
      return expect(ele.id).toEqual(id);
    }

    it('id passed', () => {
      const { container } = render(<Demo id="bamboo" />);
      matchId(container, 'bamboo');
    });

    it('test env', () => {
      const { container } = render(<Demo />);
      matchId(container, 'test-id');
    });

    it('react useId', () => {
      const errorSpy = jest.spyOn(console, 'error');
      const originEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // SSR
      const content = renderToString(<Demo />);
      expect(content).not.toContain('test-id');

      // Hydrate
      const holder = document.createElement('div');
      holder.innerHTML = content;
      const {} = render(<Demo />, {
        hydrate: true,
        container: holder,
      });

      expect(errorSpy).not.toHaveBeenCalled();

      errorSpy.mockRestore();
      process.env.NODE_ENV = originEnv;
    });
  });

  describe('useMobile', () => {
    it('should work', () => {
      const Demo = () => {
        const isMobile = useMobile();
        return <div>{isMobile ? 'mobile' : 'pc'}</div>;
      };

      const { container } = render(<Demo />);
      expect(container.textContent).toBe('pc');

      const navigatorSpy = jest
        .spyOn(navigator, 'userAgent', 'get')
        .mockImplementation(() => 'Android');
      const { container: container2 } = render(<Demo />);
      expect(container2.textContent).toBe('mobile');

      navigatorSpy.mockRestore();
    });

    it('should not warn useLayoutEffect in SSR', () => {
      const errorSpy = jest.spyOn(console, 'error');
      const Demo = () => {
        useMobile();
        return null;
      };
      renderToString(<Demo />);
      expect(errorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('useLayoutEffect'),
        expect.anything(),
      );
    });
  });
});
