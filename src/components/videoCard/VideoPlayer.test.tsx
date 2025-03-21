import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { render } from '@testing-library/react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { Player, PlayerFactory } from 'boclips-player';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import mocked = jest.mocked;

jest.mock('boclips-player');

const mockedPlayer = jest.mocked(PlayerFactory);

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

  it('autoGeneratedCaptions are enabled', async () => {
    const video = VideoFactory.sample({ id: 'test-id' });

    stubBoclipsSecurity.getTokenFactory.mockReturnValueOnce(() =>
      Promise.resolve('test-token'),
    );

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <VideoPlayer video={video} />
      </BoclipsSecurityProvider>,
    );

    const options = mockedPlayer.get.mock.calls[0][1];
    const generatedCaptionsEnabled = options.displayAutogeneratedCaptions;
    expect(generatedCaptionsEnabled).toBeTruthy();
  });

  it('passes down segment to player', async () => {
    const video = VideoFactory.sample({ id: 'test-id' });

    stubBoclipsSecurity.getTokenFactory.mockReturnValueOnce(() =>
      Promise.resolve('test-token'),
    );

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <VideoPlayer video={video} segment={{ start: 1, end: 123 }} />
      </BoclipsSecurityProvider>,
    );

    const player: Player = mocked(PlayerFactory.get).mock.results[0].value;

    expect(player.loadVideo).toHaveBeenCalledWith(
      video.links.self.getOriginalLink(),
      {
        start: 1,
        end: 123,
      },
    );
  });

  it('should render player without security context', async () => {
    const video = VideoFactory.sample({ id: 'test-id' });

    render(<VideoPlayer video={video} />);

    expect(PlayerFactory.get).toHaveBeenCalled();
  });
});
