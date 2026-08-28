jest.mock('react', () => ({
  ...jest.requireActual('react'),
  version: undefined,
}));

describe('ref without a React version export', () => {
  it('loads without throwing', () => {
    expect(() => jest.requireActual('../src/ref')).not.toThrow();
  });
});
