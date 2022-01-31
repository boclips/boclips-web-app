import { render, screen } from '@testing-library/react';
import React from 'react';
import PlaylistTile from 'src/components/playlists/playlistTile/PlaylistTile';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';

describe('Playlist Tile', () => {
  it('has an href to single playlist', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <MemoryRouter>
            <PlaylistTile name="test name" id="test-id" />
          </MemoryRouter>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText('test name').closest('a')).toHaveAttribute(
      'href',
      '/library/test-id',
    );
  });
});
