import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line import/extensions
import { disciplines } from 'src/components/disciplinesWidget/disciplinesFixture';
import { createBrowserHistory } from 'history';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { resizeToDesktop } from 'src/testSupport/resizeTo';

describe('HomeView', () => {
  beforeEach(() => {
    resizeToDesktop(1024);
  });
  it('loads the home view text', async () => {
    const wrapper = render(
      <MemoryRouter>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText('Let’s find the videos you need'),
    ).toBeInTheDocument();
  });

  it('displays Coursespark as window title', async () => {
    render(
      <MemoryRouter>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    const helmet = Helmet.peek();

    expect(helmet.title).toEqual('CourseSpark');
  });

  it('redirects to search (video) page with selected subject filter and query', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    // eslint-disable-next-line array-callback-return
    disciplines.map((discipline) => {
      fakeClient.disciplines.insertMyDiscipline(discipline);
    });

    const expectedPathname = '/videos';
    const expectedSearch = `?subject=${disciplines[0].subjects[1].id}`;

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <QueryClientProvider client={client}>
          <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
        </QueryClientProvider>
      </Router>,
    );

    fireEvent.click(await wrapper.findByText(disciplines[0].name));

    const subject = await wrapper.findByText(disciplines[0].subjects[1].name);

    fireEvent.click(subject);

    expect(history.location.pathname).toEqual(expectedPathname);
    expect(history.location.search).toEqual(expectedSearch); // search = query parameters
  });

  it('Search is visible on homepage', async () => {
    const wrapper = render(
      <MemoryRouter>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(
      await wrapper.getByPlaceholderText('Search for videos'),
    ).toBeInTheDocument();
  });
});
