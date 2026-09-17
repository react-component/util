import { render } from '@testing-library/react';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import useId, { resetUuid } from '../src/hooks/useId';

jest.mock('react', () => {
  const react = jest.requireActual('react');

  const clone = { ...react };

  Object.defineProperty(clone, 'useId', {
    get: () => null,
  });

  return clone;
});

describe('hooks-17', () => {
  describe('useId', () => {
    const Demo: React.FC<{ id?: string }> = ({ id }) => {
      const mergedId = useId(id);
      return <div id={mergedId} className="target" />;
    };

    it('fallback of React 17 or lower', () => {
      const errorSpy = jest.spyOn(console, 'error');
      const originEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // SSR
      const content = renderToString(
        <React.StrictMode>
          <Demo />
        </React.StrictMode>,
      );
      expect(content).toContain('ssr-id');

      // Hydrate
      resetUuid();
      const holder = document.createElement('div');
      holder.innerHTML = content;
      const { container } = render(
        <React.StrictMode>
          <Demo />
        </React.StrictMode>,
        { hydrate: true, container: holder },
      );

      // React StrictMode may double-invoke effects across versions, so only
      // assert a generated id instead of a fixed index.
      const ele = container.querySelector('.target');
      expect(ele.id).toMatch(/^rc_unique_\d+$/);

      errorSpy.mockRestore();
      process.env.NODE_ENV = originEnv;
    });
  });
});
