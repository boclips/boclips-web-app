import { getVideoPageLicenseDurationLabel } from 'src/services/getVideoLicenseDurationLabel';

describe('Get video license duration label', () => {
  describe('For video page', () => {
    it('displays 1 year', () => {
      const label = getVideoPageLicenseDurationLabel(1);
      expect(label).toEqual('1 year');
    });

    it('displays 13 years', () => {
      const label = getVideoPageLicenseDurationLabel(13);
      expect(label).toEqual('13 years');
    });

    it('displays 10+ years if maxDuration is null', () => {
      const label = getVideoPageLicenseDurationLabel(null);
      expect(label).toEqual('10+ years');
    });

    it('displays unavailable if maxDuration is undefined', () => {
      const label = getVideoPageLicenseDurationLabel(undefined);
      expect(label).toEqual('Unavailable');
    });

    it('displays 3 years', () => {
      const label = getVideoPageLicenseDurationLabel(3);
      expect(label).toEqual('3 years');
    });
  });
});
