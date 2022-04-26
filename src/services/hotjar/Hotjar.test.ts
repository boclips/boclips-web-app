import Hotjar from 'src/services/hotjar/Hotjar';

describe('Hotjar', () => {
  let mockHotjar: (service: string, id: string, payload?: object) => void;
  let hotjar;

  beforeEach(() => {
    mockHotjar = jest.fn();
    hotjar = new Hotjar(mockHotjar);
  });

  it('warns when hj function is not defined', () => {
    const warning = jest.spyOn(console, 'warn');

    hotjar = new Hotjar();

    expect(warning).toHaveBeenCalledWith(
      'Hotjar is not defined. Setting up empty Hotjar func',
    );
  });

  it('does nothing when hj function is not defined', () => {
    hotjar = new Hotjar();

    expect(() => {
      hotjar.sendEvent('some_event');
      hotjar.sendIdentity('id-77', {});
    }).not.toThrowError();
  });

  it('sends identity', () => {
    const id = 'id-1';
    const payload = {
      when: '2022-04-25',
    };

    hotjar.sendIdentity(id, payload);

    expect(mockHotjar).toHaveBeenCalledWith('identity', id, {
      when: '2022-04-25',
    });
  });

  it('sends event', () => {
    hotjar.sendEvent('SomethingOccurred');

    expect(mockHotjar).toHaveBeenCalledWith('event', 'SomethingOccurred');
  });
});
