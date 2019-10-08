import { composeRef } from '../src/ref';

describe('ref', () => {
  it('composeRef', () => {
    const refFunc1 = jest.fn();
    const refFunc2 = jest.fn();

    const mergedRef = composeRef(refFunc1, refFunc2);
    const testRefObj = {};
    mergedRef(testRefObj);
    expect(refFunc1).toHaveBeenCalledWith(testRefObj);
    expect(refFunc2).toHaveBeenCalledWith(testRefObj);
  });
});
