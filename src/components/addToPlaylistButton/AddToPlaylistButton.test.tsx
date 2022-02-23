import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';

describe('Add to playlist button', () => {
  const video = VideoFactory.sample({
    title: 'video killed the radio star',
  });

  it('displays info if there is no playlists', async () => {
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={video.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');

    fireEvent.click(playlistButton);

    expect(
      await wrapper.findByText('You have no playlists yet'),
    ).toBeInTheDocument();
  });

  it('clicking on playlist button opens popover that can be closed with X button', async () => {
    const fakeClient = new FakeBoclipsClient();

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={video.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');
    fireEvent.click(playlistButton);

    fireEvent.click(await wrapper.findByLabelText('close add to playlist'));
    expect(wrapper.queryByText('Add to playlist')).not.toBeInTheDocument();
  });

  it('there are only own and not shared playlists visible in popover', async () => {
    const fakeClient = new FakeBoclipsClient();

    const playlists = [
      CollectionFactory.sample({
        id: '1',
        title: 'Playlist 1',
        owner: 'user-123',
        mine: true,
      }),
      CollectionFactory.sample({
        id: '2',
        title: 'Playlist 2',
        owner: 'user-123',
        mine: true,
      }),
      CollectionFactory.sample({
        id: '3',
        title: 'Playlist 3',
        owner: 'different-user',
        mine: false,
      }),
    ];

    fakeClient.collections.setCurrentUser('user-123');
    playlists.forEach((it) => fakeClient.collections.addToFake(it));

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AddToPlaylistButton videoId={video.id} />
      </BoclipsClientProvider>,
    );

    const playlistButton = await wrapper.findByLabelText('Add to playlist');
    fireEvent.click(playlistButton);

    expect(await wrapper.findByText('Playlist 1')).toBeInTheDocument();
    expect(await wrapper.findByText('Playlist 2')).toBeInTheDocument();
    expect(wrapper.queryByText('Playlist 3')).not.toBeInTheDocument();
  });
});
