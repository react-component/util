import { CSSProperties } from 'react';
import setStyle from '../src/setStyle';

describe('setStyle', () => {
  afterEach(() => {
    // reset
    document.body.className = '';
    document.body.setAttribute('style', '');
  });

  it('setStyle correct', () => {
    let cacheStyle = {};

    const style: CSSProperties = {
      position: 'relative',
      width: '100px',
    };

    cacheStyle = setStyle(style);

    expect(document.body.style.cssText.replace(/\s/g, '')).toBe(
      `${JSON.stringify(style)
        .replace(/[\\"|{|}|\s]/g, '')
        .replace(/,/g, ';')};`,
    );
    expect(cacheStyle).toEqual({
      position: '',
      width: '',
    });
  });

  it('setStyle correct if has style', () => {
    document.body.style.position = 'absolute';
    let cacheStyle = {};

    cacheStyle = setStyle({
      position: 'relative',
    });

    expect(cacheStyle).toEqual({
      position: 'absolute',
    });
  });
});
