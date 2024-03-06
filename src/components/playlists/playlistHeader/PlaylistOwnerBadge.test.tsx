import { render } from '@testing-library/react';
import React from 'react';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { MemoryRouter } from 'react-router-dom';
import PlaylistOwnerBadge from 'src/components/playlists/playlistHeader/PlaylistOwnerBadge';

describe('Playlist Owner Badge', () => {
  it('displays you when playlist is owned by current user', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      mine: true,
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistOwnerBadge playlist={playlist} />
      </MemoryRouter>,
    );

    expect(wrapper.getByLabelText('playlist owned by You')).toBeInTheDocument();
    expect(wrapper.getByText('By: You')).toBeVisible();
  });

  it('displays playlist owner name', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      mine: false,
      ownerName: 'The Owner',
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistOwnerBadge playlist={playlist} />
      </MemoryRouter>,
    );

    expect(
      wrapper.getByLabelText('playlist owned by The Owner'),
    ).toBeInTheDocument();
    expect(wrapper.getByText('By: The Owner')).toBeVisible();
  });

  it('displays nothing when owner name not provided', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      mine: false,
      ownerName: '',
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistOwnerBadge playlist={playlist} />
      </MemoryRouter>,
    );

    expect(
      wrapper.queryByLabelText('playlist owned by', { exact: false }),
    ).not.toBeInTheDocument();
  });

  it('displays Boclips when playlist is createdBy Boclips', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      mine: false,
      createdBy: 'Boclips',
      ownerName: 'The Owner',
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistOwnerBadge playlist={playlist} />
      </MemoryRouter>,
    );

    expect(
      wrapper.getByLabelText('playlist owned by Boclips'),
    ).toBeInTheDocument();
    expect(wrapper.getByText('By: Boclips')).toBeVisible();
  });

  it('displays You when playlist is createdBy Boclips but is mine', async () => {
    const playlist = CollectionFactory.sample({
      id: '123',
      mine: true,
      createdBy: 'Boclips',
      ownerName: 'The Owner',
    });

    const wrapper = render(
      <MemoryRouter>
        <PlaylistOwnerBadge playlist={playlist} />
      </MemoryRouter>,
    );

    expect(wrapper.getByLabelText('playlist owned by You')).toBeInTheDocument();
    expect(wrapper.getByText('By: You')).toBeVisible();
  });
});
