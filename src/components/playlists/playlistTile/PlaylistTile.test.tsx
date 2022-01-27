import { render, screen } from '@testing-library/react';
import React from 'react';
import PlaylistTile from 'src/components/playlists/playlistTile/PlaylistTile';
import { MemoryRouter } from 'react-router-dom';

describe('Playlist Tile', () => {
  it('has an href to single playlist', async () => {
    render(
      <MemoryRouter>
        <PlaylistTile name="test name" id="test-id" />
      </MemoryRouter>,
    );

    expect(screen.getByText('test name').closest('a')).toHaveAttribute(
      'href',
      '/library/test-id',
    );
  });
});
