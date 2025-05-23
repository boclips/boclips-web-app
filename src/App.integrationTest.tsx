import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { render, waitFor } from '@testing-library/react';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';
import { AdminLinksFactory } from 'boclips-api-client/dist/test-support/AdminLinksFactory';
import { lastEvent } from 'src/testSupport/lastEvent';

describe('App', () => {
  const security: BoclipsSecurity = {
    ...stubBoclipsSecurity,
    hasRole: (_role) => true,
  };

  it('renders the end of trial page on user having reportAccessExpired role and emits event', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.links.reportAccessExpired = {
      href: '/expired',
      templated: false,
    };

    const wrapper = render(
      <MemoryRouter>
        <App boclipsSecurity={security} apiClient={apiClient} />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText('Your Boclips Classroom Trial has Expired'),
    ).toBeVisible();
    await waitFor(() => {
      expect(lastEvent(apiClient, 'PLATFORM_INTERACTED_WITH')).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'CLASSROOM_TRIAL_EXPIRED_SCREEN_VIEWED',
        anonymous: false,
      });
    });
  });

  it('renders the not found page on user having incorrect role', async () => {
    const fakeApi = new FakeBoclipsClient();
    delete fakeApi.links.boclipsWebAppAccess;
    delete fakeApi.links.classroomWebAppAccess;

    const wrapper = render(
      <MemoryRouter>
        <App boclipsSecurity={security} apiClient={fakeApi} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });
  it('renders the not found page on user accessing cart but not having cart link', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.links = AdminLinksFactory.sample({ cart: null });
    const wrapper = render(
      <MemoryRouter initialEntries={['/cart']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it('renders the not found page on user accessing orders but not having userOrders link', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.links = AdminLinksFactory.sample({ userOrders: null });
    const wrapper = render(
      <MemoryRouter initialEntries={['/orders']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it('renders the not found page on user accessing order details but not having order link', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.links = AdminLinksFactory.sample({ order: null });
    const wrapper = render(
      <MemoryRouter initialEntries={['/orders/123']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it("doesn't render the not found page if user has correct role", async () => {
    const wrapper = render(
      <MemoryRouter>
        <App boclipsSecurity={security} apiClient={new FakeBoclipsClient()} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to Boclips Library',
    );
    expect(wrapper.queryByText('Page not found!')).not.toBeInTheDocument();
  });

  it('renders the provider page if user has correct role', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.alignments.setProviders([ProviderFactory.sample('openstax')]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/alignments/openstax']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(wrapper.queryByText('Page not found!')).not.toBeInTheDocument();
    expect(await wrapper.findByText('Our OpenStax collection')).toBeVisible();
  });

  it('redirects to playlists page if accessing library', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <MemoryRouter initialEntries={['/library']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(wrapper.queryByText('Page not found!')).not.toBeInTheDocument();
    expect(await wrapper.findByText('Playlists')).toBeVisible();
  });

  it('redirects from explore/openstax to alignments/openstax', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();

    const history = createBrowserHistory();
    history.push('/explore/openstax');

    render(
      <BoclipsClientProvider client={fakeBoclipsClient}>
        <Router location={history.location} navigator={history}>
          <App
            boclipsSecurity={stubBoclipsSecurity}
            apiClient={fakeBoclipsClient}
          />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(history.location.pathname).toEqual('/alignments/openstax');
  });

  it('alignments routes to alignments view', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    const history = createBrowserHistory();
    history.push('/alignments');

    const wrapper = render(
      <BoclipsClientProvider client={fakeBoclipsClient}>
        <Router location={history.location} navigator={history}>
          <App
            boclipsSecurity={stubBoclipsSecurity}
            apiClient={fakeBoclipsClient}
          />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('aligned')).toBeVisible();
  });

  it('alignments/provider routes to alignment provider view', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    const history = createBrowserHistory();
    fakeBoclipsClient.alignments.setProviders([
      ProviderFactory.sample('openstax', { id: 'openstax' }),
    ]);
    history.push('/alignments/openstax');

    const wrapper = render(
      <BoclipsClientProvider client={fakeBoclipsClient}>
        <Router location={history.location} navigator={history}>
          <App
            boclipsSecurity={stubBoclipsSecurity}
            apiClient={fakeBoclipsClient}
          />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Our OpenStax collection')).toBeVisible();
  });

  it('alignments/provider/theme routes to theme view', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    const history = createBrowserHistory();
    fakeBoclipsClient.alignments.setProviders([
      ProviderFactory.sample('openstax', { id: 'openstax' }),
    ]);

    fakeBoclipsClient.alignments.setThemesByProvider({
      providerName: 'openstax',
      themes: [ThemeFactory.sample({ id: 'id-1', title: 'theme-1' })],
    });
    history.push('/alignments/openstax/id-1');

    const wrapper = render(
      <BoclipsClientProvider client={fakeBoclipsClient}>
        <Router location={history.location} navigator={history}>
          <App
            boclipsSecurity={stubBoclipsSecurity}
            apiClient={fakeBoclipsClient}
          />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('theme-1')).toBeVisible();
  });

  it('redirects from specific bookmark in openstax book to alignments URL', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();

    const history = createBrowserHistory();
    history.push(
      '/explore/openstax/6334620ec2250a8569f696c3#chapter-0-section-2',
    );

    render(
      <BoclipsClientProvider client={fakeBoclipsClient}>
        <Router location={history.location} navigator={history}>
          <App
            boclipsSecurity={stubBoclipsSecurity}
            apiClient={fakeBoclipsClient}
          />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(history.location.pathname).toEqual(
      '/alignments/openstax/6334620ec2250a8569f696c3',
    );
    expect(history.location.hash).toEqual('#topic-0-target-2');
  });

  it('home should display admin welcome popup if user is in trial and has no marketing info', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'trial',
          name: 'trial',
          type: AccountType.TRIAL,
          marketingInformation: { companySegments: null },
        },
        desiredContent: undefined,
        audiences: undefined,
      }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText('Tell us a bit more about you'),
    ).toBeVisible();
  });

  it('redirects to Licenses page when hitting /content url', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <MemoryRouter initialEntries={['/content']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText('No results found for Licenses.'),
    ).toBeVisible();
  });

  it('redirects to Licenses page when hitting /licenses url', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <MemoryRouter initialEntries={['/licenses']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText('No results found for Licenses.'),
    ).toBeVisible();
  });
});
