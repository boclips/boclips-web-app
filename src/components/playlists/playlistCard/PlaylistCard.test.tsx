import { render, screen } from '@testing-library/react';
import React from 'react';
import PlaylistCard from 'src/components/playlists/playlistCard/PlaylistCard';
import { MemoryRouter } from 'react-router-dom';

describe('Playlist Card', () => {
  it('has an href to single playlist', async () => {
    render(
      <MemoryRouter>
        <PlaylistCard
          header={<div />}
          name="test name"
          link="/library/test-id"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('test name').closest('a')).toHaveAttribute(
      'href',
      '/library/test-id',
    );
  });
});
