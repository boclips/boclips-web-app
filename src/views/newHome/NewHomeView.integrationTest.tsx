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
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe('HomeView', () => {
  beforeEach(() => {
    resizeToDesktop(1024);
  });
  it('loads the home view buttons', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/new-home']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );
    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to CourseSpark!',
    );
    expect(await wrapper.findByText('Browse All Videos')).toBeInTheDocument();
    expect(await wrapper.findByText('View My Playlists')).toBeInTheDocument();
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

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location="/new-home" navigator={history}>
        <QueryClientProvider client={client}>
          <App
            apiClient={fakeClient}
            boclipsSecurity={stubBoclipsSecurity}
            reactQueryClient={createReactQueryClient()}
          />
        </QueryClientProvider>
      </Router>,
    );
    fireEvent.click(await wrapper.findByText('Browse All Videos'));

    expect(history.location.pathname).toEqual('/videos');
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

  it(`displays featured videos and playlists`, async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.collections.addToFake(
      CollectionFactory.sample({
        title: 'my promoted playlist',
        videos: [VideoFactory.sample({})],
        promoted: true,
      }),
    );
    fakeBoclipsClient.videos.insertVideo(
      VideoFactory.sample({
        id: '63c04899bf161a652f79f0ed',
        title: 'my promoted video',
        promoted: true,
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

    expect(
      await wrapper.findByText('my promoted playlist'),
    ).toBeInTheDocument();
    expect(await wrapper.findByText('my promoted video')).toBeInTheDocument();
  });
});
