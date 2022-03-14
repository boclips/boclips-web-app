import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { render } from '@testing-library/react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlayerFactory } from 'boclips-player';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';

jest.mock('boclips-player');

const mockedPlayer = jest.mocked(PlayerFactory, true);

describe('VideoPlayer', () => {
  it('provides a token factory to the player that returns a valid token', async () => {
    const video = VideoFactory.sample({ id: 'test-id' });

    stubBoclipsSecurity.getTokenFactory.mockReturnValueOnce(() =>
      Promise.resolve('test-token'),
    );

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <VideoPlayer video={video} />
      </BoclipsSecurityProvider>,
    );

    expect(PlayerFactory.get).toHaveBeenCalled();

    const options = mockedPlayer.get.mock.calls[0][1];
    const providedTokenFactory = options.api.tokenFactory;

    await expect(providedTokenFactory()).resolves.toEqual('test-token');
  });
});
