import { render } from '@testing-library/react';
import React from 'react';
import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import UnauthorizedPlaylistHeader from '@components/playlists/playlistHeader/UnauthorizedPlaylistHeader';

describe('Unauthorized Playlist Header', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  const renderWrapper = (
    playlist: Collection,
    fakeClient: FakeBoclipsClient = new FakeBoclipsClient(),
  ) => {
    return render(
      <MemoryRouter>
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={new QueryClient()}>
            <UnauthorizedPlaylistHeader playlist={playlist} />
          </QueryClientProvider>
        </BoclipsClientProvider>
      </MemoryRouter>,
    );
  };

  it('has playlist title', async () => {
    const title = 'test playlist';
    const playlist = CollectionFactory.sample({
      id: '123',
      title,
      description: 'Description',
    });

    const wrapper = renderWrapper(playlist);

    const titleElement = await wrapper.findByTestId('playlistTitle');

    expect(titleElement).toBeVisible();
    expect(titleElement.innerHTML).toBe(title);
  });

  it('has visible playlist owner name', async () => {
    const title = 'test playlist';
    const playlist = CollectionFactory.sample({
      id: '123',
      title,
      description: 'Description',
      mine: false,
      ownerName: 'The Owner',
    });

    const wrapper = renderWrapper(playlist);
    expect(wrapper.getByText('By: The Owner')).toBeVisible();
  });
});
