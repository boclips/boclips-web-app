import MixpanelService from './MixpanelService';

const mixpanelMock = jest.createMockFromModule('mixpanel-browser') as Mixpanel;

describe('MixpanelService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards track to mixpanel', () => {
    const mixpanelService = new MixpanelService(mixpanelMock);
    mixpanelService.track('video_recommendation_url_copied', {});

    expect(mixpanelMock.track).toHaveBeenCalledWith(
      'video_recommendation_url_copied',
      {},
    );
  });

  it('handles null mixpanel', () => {
    const mixpanelService = new MixpanelService(null);
    expect(() =>
      mixpanelService.track('video_recommendation_played'),
    ).not.toThrow();
  });
});
