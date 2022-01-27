import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import {
  CollectionFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

describe('Playlist view', () => {
  it("shows Playlist's title and description if user can access", async () => {
    const client = new FakeBoclipsClient();

    client.users.insertCurrentUser(
      UserFactory.sample({ features: { BO_WEB_APP_ENABLE_PLAYLISTS: true } }),
    );

    const playlist = CollectionFactory.sample({
      id: '123',
      title: 'Hello there',
      description: 'Very nice description',
    });

    client.collections.addToFake(playlist);

    render(
      <MemoryRouter initialEntries={['/library/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Hello there')).toBeVisible();
    expect(screen.getByText('Very nice description')).toBeVisible();
  });
});
