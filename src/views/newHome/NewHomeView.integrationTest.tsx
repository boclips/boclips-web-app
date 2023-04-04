import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { Helmet } from 'react-helmet';
import { createBrowserHistory } from 'history';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { resizeToDesktop } from 'src/testSupport/resizeTo';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';

describe('HomeView', () => {
  beforeEach(() => {
    resizeToDesktop(1024);
  });
  it('loads the home view text', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/new-home']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText('Welcome to CourseSpark!'),
    ).toBeInTheDocument();
  });

  it('displays Coursespark as window title', async () => {
    render(
      <MemoryRouter initialEntries={['/new-home']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    const helmet = Helmet.peek();

    expect(helmet.title).toEqual('CourseSpark');
  });

  it('redirects to empty search (video) page with no filters or query', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    const expectedPathname = '/videos';
    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <QueryClientProvider client={client}>
          <App
            apiClient={fakeClient}
            boclipsSecurity={stubBoclipsSecurity}
            reactQueryClient={createReactQueryClient()}
          />
        </QueryClientProvider>
      </Router>,
    );
    fireEvent.click(await wrapper.findByText('All videos'));

    expect(history.location.pathname).toEqual(expectedPathname);
    expect(history.location.search).toBeEmpty(); // search = query parameters
  });

  it('Search is visible on homepage', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/new-home']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(
      await wrapper.getByPlaceholderText('Search for videos'),
    ).toBeInTheDocument();
  });

  it(`displays recommended playlists`, () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.collections.addToFake(
      CollectionFactory.sample({
        title: 'My Promoted Playlist',
        promoted: true,
      }),
    );
    fakeBoclipsClient.collections.addToFake(
      CollectionFactory.sample({
        title: 'My Non-Promoted Playlist',
        promoted: false,
      }),
    );
    const wrapper = render(
      <MemoryRouter initialEntries={['/new-home']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeBoclipsClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(wrapper.getByText('My Promoted Playlist')).toBeInTheDocument();
    expect(
      wrapper.queryByText('My Non-Promoted Playlist'),
    ).not.toBeInTheDocument();
  });

  it(`displys link to search view`, () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.collections.addToFake(
      CollectionFactory.sample({
        title: 'My Promoted Playlist',
        promoted: true,
      }),
    );
    fakeBoclipsClient.collections.addToFake(
      CollectionFactory.sample({
        title: 'My Non-Promoted Playlist',
        promoted: false,
      }),
    );
    const wrapper = render(
      <MemoryRouter initialEntries={['/new-home']}>
        <App
          apiClient={fakeBoclipsClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(wrapper.getByText('My Promoted Playlist')).toBeInTheDocument();
    expect(
      wrapper.queryByText('My Non-Promoted Playlist'),
    ).not.toBeInTheDocument();
  });
});
