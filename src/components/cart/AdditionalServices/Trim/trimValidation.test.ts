import dayjs from '../../../../day-js/index';
import {
  durationString,
  isTrimFromValid,
  isTrimToValid,
} from './trimValidation';

describe('Trim validation', () => {
  const videoDuration = dayjs.duration('PT1M10S');

  describe('From validation', () => {
    it('is invalid when to and from are the same', () => {
      expect(
        isTrimFromValid({ from: '1:00', to: '1:00' }, videoDuration),
      ).toBeFalsy();
    });

    it('is invalid when from is greater than to', () => {
      expect(
        isTrimFromValid({ to: '00:00', from: '1:00' }, videoDuration),
      ).toBeFalsy();
    });

    it('is invalid when full video length is chosen', () => {
      expect(
        isTrimFromValid({ from: '00:00', to: '1:10' }, videoDuration),
      ).toBeFalsy();
    });

    it('is invalid when from is null', () => {
      expect(
        isTrimFromValid({ from: null, to: '1:10' }, videoDuration),
      ).toBeFalsy();
    });

    it('is valid when to is null', () => {
      expect(
        isTrimFromValid({ from: '1:00', to: null }, videoDuration),
      ).toBeTruthy();
    });

    it('is valid when "to" value is greater than video length', () => {
      expect(
        isTrimFromValid({ from: '00:00', to: '1:20' }, videoDuration),
      ).toBeTruthy();
    });
  });

  describe('To validation', () => {
    it('is invalid when to and from are the same', () => {
      expect(
        isTrimToValid({ from: '1:00', to: '1:00' }, videoDuration),
      ).toBeFalsy();
    });

    it('is invalid when from is greater than to', () => {
      expect(
        isTrimToValid({ from: '1:00', to: '00:00' }, videoDuration),
      ).toBeFalsy();
    });

    it('is invalid when full video length is chosen', () => {
      expect(
        isTrimToValid({ from: '00:00', to: '1:10' }, videoDuration),
      ).toBeFalsy();
    });

    it('is valid when from is null', () => {
      expect(
        isTrimToValid({ from: null, to: '1:10' }, videoDuration),
      ).toBeTruthy();
    });

    it('is invalid when to is null', () => {
      expect(
        isTrimToValid({ from: '1:00', to: null }, videoDuration),
      ).toBeFalsy();
    });

    it('is invalid when value is greater than video length', () => {
      expect(
        isTrimToValid({ from: '00:00', to: '1:20' }, videoDuration),
      ).toBeFalsy();
    });
  });

  describe('Duration string', () => {
    it('converts duration into string', () => {
      expect(durationString(112)).toEqual('01:52');
      expect(durationString(120)).toEqual('02:00');
      expect(durationString(1201)).toEqual('20:01');
      expect(durationString(43)).toEqual('00:43');
    });
  });
});
