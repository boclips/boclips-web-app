import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from '@src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { BoclipsSecurityProvider } from '@src/components/common/providers/BoclipsSecurityProvider';
import { PlaylistBodyEmptyState } from '@src/components/playlists/emptyState/EmptyState';

describe('Empty State', () => {
  const getWrapper = (fakeClient = new FakeBoclipsClient()) => {
    fakeClient.videos.insertVideo(VideoFactory.sample({}));
    return render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter>
              <PlaylistBodyEmptyState />
            </MemoryRouter>
          </QueryClientProvider>
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );
  };

  describe('Playlist Body', () => {
    it('renders playlist body empty state', async () => {
      const wrapper = getWrapper();

      expect(await wrapper.findByText('No videos here yet.')).toBeVisible();
      expect(
        wrapper.getByText('You can see videos here once you add some.'),
      ).toBeVisible();
      expect(wrapper.getByRole('button', { name: 'Add videos' })).toBeVisible();
    });
  });
});
