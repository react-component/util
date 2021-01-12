import omit from '../src/omit';

describe('omit', () => {
  it('should work', () => {
    const ret = omit({ keep: 1, ignore: 2, anotherKeep: 3 }, ['ignore']);
    expect(ret).toEqual({ keep: 1, anotherKeep: 3 });
  });
});
