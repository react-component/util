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
});
