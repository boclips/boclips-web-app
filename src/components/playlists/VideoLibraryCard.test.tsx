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
    const video = VideoFactory.sample({ id: 'video-123', title: 'Cats' });

    client.videos.insertVideo(video);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={client}>
          <MemoryRouter>
            <VideoLibraryCard video={video} />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByLabelText('Thumbnail of Cats'),
    ).toBeInTheDocument();
    expect(screen.getByRole('img').closest('a')).toHaveAttribute(
      'href',
      '/videos/video-123',
    );
  });
});
