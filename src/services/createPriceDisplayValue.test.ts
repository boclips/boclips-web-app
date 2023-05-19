import { createPriceDisplayValue } from './createPriceDisplayValue';

describe('get price display value', () => {
  it('returns null if nothing is passed in', () => {
    expect(createPriceDisplayValue()).toBeNull();
  });
  describe('Credits', () => {
    it('converts 0 credits', () => {
      expect(createPriceDisplayValue(0, 'CREDITS', 'en-US')).toEqual(
        '0 Credits',
      );
    });
    it('converts 300.5 Credits', () => {
      expect(createPriceDisplayValue(300.5, 'CREDITS', 'en-GB')).toEqual(
        '300.50 Credits',
      );
    });
    it('converts case insensitively', () => {
      expect(createPriceDisplayValue(300.5, 'credits', 'en-US')).toEqual(
        '300.50 Credits',
      );
    });
  });
  describe('US Browser', () => {
    it('converts 0 USD', () => {
      expect(createPriceDisplayValue(0, 'USD', 'en-US')).toEqual('$0');
    });
    it('converts 300.5 GBP', () => {
      expect(createPriceDisplayValue(300.5, 'GBP', 'en-US')).toEqual('£300.50');
    });
    it('converts 300.5 USD', () => {
      expect(createPriceDisplayValue(300.5, 'USD', 'en-US')).toEqual('$300.50');
    });
    it('converts 300.5 EUR', () => {
      expect(createPriceDisplayValue(300.5, 'EUR', 'en-US')).toEqual('€300.50');
    });
  });
  describe('UK Browser', () => {
    it('converts 0 USD', () => {
      expect(createPriceDisplayValue(0, 'USD', 'en-US')).toEqual('$0');
    });
    it('converts 300.5 GBP', () => {
      expect(createPriceDisplayValue(300.5, 'GBP', 'en-GB')).toEqual('£300.50');
    });
    it('converts 300.5 USD', () => {
      expect(createPriceDisplayValue(300.5, 'USD', 'en-GB')).toEqual('$300.50');
    });
    it('converts 300.5 EUR', () => {
      expect(createPriceDisplayValue(300.5, 'EUR', 'en-GB')).toEqual('€300.50');
    });
  });
  describe('German Browser', () => {
    it('converts 0 USD', () => {
      expect(createPriceDisplayValue(0, 'USD', 'en-US')).toEqual('$0');
    });
    it('converts 300.5 GBP', () => {
      expect(createPriceDisplayValue(300.5, 'GBP', 'de-DE')).toEqual(
        '300,50 £',
      );
    });
    it('converts 300.5 USD', () => {
      expect(createPriceDisplayValue(300.5, 'USD', 'de-DE')).toEqual(
        '300,50 $',
      );
    });
    it('converts 300.5 EUR', () => {
      expect(createPriceDisplayValue(300.5, 'EUR', 'de-DE')).toEqual(
        '300,50 €',
      );
    });
  });
  describe(`error state`, () => {
    it(`falls back to US formatting when locale is unknown`, () => {
      expect(createPriceDisplayValue(300.5, 'USD', 'zh-TW')).toEqual('$300.50');
    });
    it(`throws an error if currency is unknown`, () => {
      expect(() => {
        createPriceDisplayValue(300.5, '!G%', 'de-DE');
      }).toThrow('Currency !G% not found');
    });
  });
});
