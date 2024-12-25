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

    // Call some native raf
    for (let i = 0; i < 10; i += 1) {
      const nativeId = requestAnimationFrame(() => {});
      cancelAnimationFrame(nativeId);
    }

    const id = raf(() => {
      bamboo = true;
    }, 2);
    expect(raf.ids().has(id)).toBeTruthy();

    raf.cancel(id);
    expect(raf.ids().has(id)).toBeFalsy();

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
