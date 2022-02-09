import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import PlaylistBody from 'src/components/playlists/PlaylistBody';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('Playlist Body', () => {
  it('has add to playlist button', async () => {
    const fakeClient = new FakeBoclipsClient();
    const videos = [VideoFactory.sample({ id: 'video-1', title: 'Video One' })];

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter>
              <PlaylistBody videos={videos} />
            </MemoryRouter>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    const addToPlaylistButton = await wrapper.findByRole('button', {
      name: 'Add to playlist',
    });

    expect(addToPlaylistButton).toBeVisible();
  });
});
