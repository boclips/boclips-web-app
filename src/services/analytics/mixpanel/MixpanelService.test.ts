import MixpanelService from './MixpanelService';

const mixpanel = jest.createMockFromModule('mixpanel-browser') as Mixpanel;

describe('MixpanelService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards track to mixpanel', () => {
    const mixpanelService = new MixpanelService(mixpanel);
    mixpanelService.track('sample action');

    expect(mixpanel.track).toHaveBeenCalledWith('sample action');
  });
});
