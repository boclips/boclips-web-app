import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { VideoLibraryCard } from 'src/components/playlists/VideoLibraryCard';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe('Video Library Card', () => {
  it('has an href to single Video', async () => {
    const client = new FakeBoclipsClient();

    client.videos.insertVideo(
      VideoFactory.sample({ id: 'video-123', title: 'Cats' }),
    );

    render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={client}>
          <MemoryRouter>
            <VideoLibraryCard videoId="video-123" />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await screen.findByLabelText('Thumbnail of Cats')).toBeVisible();
    expect(screen.getByLabelText('Open video about Cats')).toBeVisible();
    expect(screen.getByRole('img').closest('a')).toHaveAttribute(
      'href',
      '/videos/video-123',
    );
  });
});
