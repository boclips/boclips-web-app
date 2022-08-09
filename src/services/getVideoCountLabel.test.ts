import { getVideoCountLabel } from 'src/services/getVideoCountLabel';

describe('getVideoCountLabel', () => {
  it.each([
    [0, '0 videos'],
    [1, '1 video'],
    [3, '3 videos'],
  ])(
    'create correct label for %i video(s)',
    (videoCount: number, expectedVideoNumberLabel: string) => {
      const label = getVideoCountLabel(videoCount);
      expect(label).toEqual(expectedVideoNumberLabel);
    },
  );
});
