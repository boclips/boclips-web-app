import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import CoverWithVideo from '@components/playlists/coverWithVideo/CoverWithVideo';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from '@components/common/providers/BoclipsSecurityProvider';
import userEvent from '@testing-library/user-event';

describe('cover with video', () => {
  it('renders video cover instead of a player', () => {
    const video = VideoFactory.sample({ id: 'video-1', title: 'Video One' });

    render(
      <MemoryRouter>
        <CoverWithVideo video={video} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId(video.id)).toBeInTheDocument();
  });

  it.skip('renders video when cover is clicked', async () => {
    const video = VideoFactory.sample({ id: 'video-1', title: 'Video One' });

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <MemoryRouter>
          <CoverWithVideo video={video} />
        </MemoryRouter>
      </BoclipsSecurityProvider>,
    );

    await userEvent.click(screen.getByTestId(video.id));

    expect(screen.queryByTestId(video.id)).not.toBeInTheDocument();
    expect(screen.getByTestId('player')).toBeInTheDocument();
  });
});
