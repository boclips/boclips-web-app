import {
  getVideoOrderLicenseDurationLabel,
  getVideoPageLicenseDurationLabel,
} from 'src/services/getVideoLicenseDurationLabel';

describe('Get video license duration label', () => {
  describe('For order pages', () => {
    it('displays 1 year', () => {
      const label = getVideoOrderLicenseDurationLabel(1);
      expect(label).toEqual('Can be licensed for a maximum of 1 year');
    });

    it('displays 10+ years', () => {
      const label = getVideoOrderLicenseDurationLabel(13);
      expect(label).toEqual('Can be licensed for 10+ years');
    });

    it('displays 10+ years if maxDuration is null', () => {
      const label = getVideoOrderLicenseDurationLabel(null);
      expect(label).toEqual('Can be licensed for 10+ years');
    });

    it('displays 10+ years if maxDuration is undefined', () => {
      const label = getVideoOrderLicenseDurationLabel(undefined);
      expect(label).toEqual('Can be licensed for 10+ years');
    });

    it('displays 3 years', () => {
      const label = getVideoOrderLicenseDurationLabel(3);
      expect(label).toEqual('Can be licensed for a maximum of 3 years');
    });
  });

  describe('For video page', () => {
    it('displays 1 year', () => {
      const label = getVideoPageLicenseDurationLabel(1);
      expect(label).toEqual('1 year');
    });

    it('displays 10+ years', () => {
      const label = getVideoPageLicenseDurationLabel(13);
      expect(label).toEqual('10+ years');
    });

    it('displays 10+ years if maxDuration is null', () => {
      const label = getVideoPageLicenseDurationLabel(null);
      expect(label).toEqual('10+ years');
    });

    it('displays 10+ years if maxDuration is undefined', () => {
      const label = getVideoPageLicenseDurationLabel(undefined);
      expect(label).toEqual('10+ years');
    });

    it('displays 3 years', () => {
      const label = getVideoPageLicenseDurationLabel(3);
      expect(label).toEqual('3 years');
    });
  });
});
