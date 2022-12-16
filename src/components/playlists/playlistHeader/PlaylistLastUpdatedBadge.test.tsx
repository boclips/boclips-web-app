import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import PlaylistLastUpdatedBadge from 'src/components/playlists/playlistHeader/PlaylistLastUpdatedBadge';

describe('PlaylistLastUpdatedBadge', () => {
  it('shows last updated at date', async () => {
    const playlist = CollectionFactory.sample({
      updatedAt: new Date('2018-12-26'),
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistLastUpdatedBadge playlist={playlist} />
      </MemoryRouter>,
    );

    expect(wrapper.getByText('Last updated 26 Dec 2018')).toBeVisible();
  });

  it.each([[null], [undefined]])(
    'displays nothing when updatedAt date is %s',
    (date: Date) => {
      const playlist = CollectionFactory.sample({
        updatedAt: date,
      });

      const wrapper = render(
        <MemoryRouter>
          <PlaylistLastUpdatedBadge playlist={playlist} />
        </MemoryRouter>,
      );

      expect(
        wrapper.queryByLabelText('Playlist last updated at', { exact: false }),
      ).not.toBeInTheDocument();
    },
  );
});
