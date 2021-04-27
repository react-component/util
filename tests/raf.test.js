import raf from '../src/raf';

describe('raf', () => {
  it('test Raf', done => {
    jest.useRealTimers();

    let bamboo = false;
    raf(() => {
      bamboo = true;
    });

    expect(bamboo).toBe(false);

    raf(() => {
      expect(bamboo).toBe(true);
      done();
    });
  });

  it('cancel', done => {
    let bamboo = false;

    const id = raf(() => {
      bamboo = true;
    }, 2);

    raf.cancel(id);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          expect(bamboo).toBeFalsy();
          done();
        });
      });
    });
  });

  it('multiple times', done => {
    let bamboo = false;

    raf(() => {
      bamboo = true;
    }, 2);

    expect(bamboo).toBeFalsy();

    requestAnimationFrame(() => {
      expect(bamboo).toBeFalsy();

      requestAnimationFrame(() => {
        expect(bamboo).toBeTruthy();
        done();
      });
    });
  });
});
