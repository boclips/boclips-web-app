import Hotjar from 'src/services/analytics/hotjar/Hotjar';

describe('Hotjar', () => {
  let mockHotjar: (service: string, id: string, payload?: object) => void;
  let hotjar;

  beforeEach(() => {
    mockHotjar = vi.fn();
    hotjar = new Hotjar(mockHotjar);
  });

  it('warns when hj function is not defined if enabled', () => {
    window.Environment = {
      IS_HOTJAR_ENABLED: 'true',
    };

    const warning = vi.spyOn(console, 'warn');

    hotjar = new Hotjar();

    expect(warning).toHaveBeenCalledWith(
      'Hotjar is not defined. Setting up empty Hotjar func',
    );
  });

  it('does nothing when hj function is not defined', () => {
    hotjar = new Hotjar();

    expect(() => {
      hotjar.event('some_event');
      hotjar.identify('id-77', {});
    }).not.toThrowError();
  });

  it('identifies', () => {
    const id = 'id-1';
    const payload = {
      when: '2022-04-25',
    };

    hotjar.identify(id, payload);

    expect(mockHotjar).toHaveBeenCalledWith('identify', id, {
      when: '2022-04-25',
    });
  });

  it('sends event', () => {
    hotjar.event('SomethingOccurred');

    expect(mockHotjar).toHaveBeenCalledWith(
      'event',
      'SomethingOccurred',
      undefined,
    );
  });
});
