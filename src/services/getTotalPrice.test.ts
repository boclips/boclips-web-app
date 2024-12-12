import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { getTotalPrice } from '@src/services/getTotalPrice';

describe('getTotalPrice', () => {
  it('provides correct value for multiple videos', () => {
    const videos = [
      VideoFactory.sample({ price: { amount: 200.25, currency: 'USD' } }),
      VideoFactory.sample({ price: { amount: 530.5, currency: 'USD' } }),
    ];

    expect(getTotalPrice(videos)).toEqual({ amount: 730.75, currency: 'USD' });
  });

  it('returns null for the unlikely scenario of no videos', () => {
    expect(getTotalPrice([])).toBeNull();
  });

  it('returns null for the unlikely scenario of undefined', () => {
    expect(getTotalPrice(undefined)).toBeNull();
  });

  it('skips videos without prices', () => {
    const videos = [
      VideoFactory.sample({ price: undefined }),
      VideoFactory.sample({ price: { amount: 530.5, currency: 'USD' } }),
    ];
    expect(getTotalPrice(videos)).toEqual({ amount: 530.5, currency: 'USD' });
  });

  it('returns null when none of videos have prices', () => {
    const videos = [VideoFactory.sample({ price: undefined })];
    expect(getTotalPrice(videos)).toBeNull();
  });
});
