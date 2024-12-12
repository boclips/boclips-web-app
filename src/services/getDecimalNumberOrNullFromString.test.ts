import { getDecimalNumberOrNullFromString } from '@src/services/getDecimalNumberOrNullFromString';

describe('getDecimalNumberOrNullFromString', () => {
  it('returns null when empty string', () => {
    expect(getDecimalNumberOrNullFromString('')).toEqual(null);
  });

  it('returns null when non-number string', () => {
    expect(getDecimalNumberOrNullFromString('not a number')).toEqual(null);
  });

  it('returns null when null passed in', () => {
    expect(getDecimalNumberOrNullFromString(null)).toEqual(null);
  });

  it('returns number when decimal string passed in', () => {
    expect(getDecimalNumberOrNullFromString('123')).toEqual(123);
  });
});
