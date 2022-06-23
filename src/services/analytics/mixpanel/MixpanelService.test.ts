import MixpanelService from './MixpanelService';

const mixpanelMock = jest.createMockFromModule('mixpanel-browser') as Mixpanel;

describe('MixpanelService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards track to mixpanel', () => {
    const mixpanelService = new MixpanelService(mixpanelMock);
    mixpanelService.track('sample action');

    expect(mixpanelMock.track).toHaveBeenCalledWith('sample action');
  });

  it('handles null mixpanel', () => {
    const mixpanelService = new MixpanelService(null);
    expect(() => mixpanelService.track('sample event')).not.toThrow();
  });
});
