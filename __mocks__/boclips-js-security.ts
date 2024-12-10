const mock = jest.genMockFromModule('boclips-js-security');

(mock as any).getInstance = vi.fn().mockReturnValue({
  getTokenFactory: () => () => Promise.resolve('test-token'),
});

module.exports = mock;
