import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { render } from '@testing-library/react';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import { AccountStatus } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('App', () => {
  it('renders the not found page on user having incorrect role', async () => {
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (_role) => false,
    };
    const wrapper = render(
      <MemoryRouter>
        <App boclipsSecurity={security} apiClient={new FakeBoclipsClient()} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it("doesn't render the not found page if user has correct role", async () => {
    const security: BoclipsSecurity = {
      ...stubBoclipsSecurity,
      hasRole: (_role) => true,
    };
    const wrapper = render(
      <MemoryRouter>
        <App boclipsSecurity={security} apiClient={new FakeBoclipsClient()} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to CourseSpark!',
    );
    expect(wrapper.queryByText('Page not found!')).not.toBeInTheDocument();
  });

  it('renders the provider page if user has correct role', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.setCurrentUserFeatures({ BO_WEB_APP_SPARKS: true });
    apiClient.alignments.setProviders([ProviderFactory.sample('openstax')]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks/openstax']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(wrapper.queryByText('Page not found!')).not.toBeInTheDocument();
    expect(await wrapper.findByText('Our OpenStax collection')).toBeVisible();
  });

  it(`renders the not found page if user doesn't have role to view alignments`, async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.setCurrentUserFeatures({ BO_WEB_APP_SPARKS: false });
    apiClient.alignments.setTypesForProvider('openstax', []);

    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks/openstax']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it('redirects to playlists page if accessing library', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.setCurrentUserFeatures({ BO_WEB_APP_SPARKS: true });

    const wrapper = render(
      <MemoryRouter initialEntries={['/library']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(wrapper.queryByText('Page not found!')).not.toBeInTheDocument();
    expect(await wrapper.findByText('Playlists')).toBeVisible();
  });

  it('redirects from explore/openstax to sparks/openstax', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.setCurrentUserFeatures({
      BO_WEB_APP_SPARKS: true,
    });

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

    expect(history.location.pathname).toEqual('/sparks/openstax');
  });

  it('redirects from specific bookmark in openstax book to sparks URL', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.setCurrentUserFeatures({
      BO_WEB_APP_SPARKS: true,
    });

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
      '/sparks/openstax/6334620ec2250a8569f696c3',
    );
    expect(history.location.hash).toEqual('#topic-0-target-2');
  });

  it('renders registration view when user is logged in and has dev flag', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });

    const wrapper = render(
      <MemoryRouter initialEntries={['/register']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Create new account')).toBeVisible();
    expect(wrapper.getByText('Copyright ©', { exact: false })).toBeVisible();
  });

  it('renders page not found when user is logged in but has no dev flag when accessing registration page', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: false });

    const wrapper = render(
      <MemoryRouter initialEntries={['/register']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
  });

  it('redirects to trial welcome page for trial users with missing marketing info', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'trial', status: AccountStatus.TRIAL }),
    );
    apiClient.users.insertCurrentUser(
      UserFactory.sample({ account: { id: 'trial', name: 'trial' } }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/videos']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText(
        "You've just been added to Boclips by your colleague",
      ),
    ).toBeVisible();
  });

  it('renders home view instead of trial welcome for non trial users', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'not-trial', status: AccountStatus.ACTIVE }),
    );
    apiClient.users.insertCurrentUser(
      UserFactory.sample({ account: { id: 'not-trial', name: 'regular' } }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/welcome']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to CourseSpark!',
    );
  });

  it('/welcome renders home view instead of trial welcome for non trial users', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'not-trial', status: AccountStatus.ACTIVE }),
    );
    apiClient.users.insertCurrentUser(
      UserFactory.sample({ account: { id: 'not-trial', name: 'regular' } }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/welcome']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to CourseSpark!',
    );
  });
  it('any page should redirect to welcome view if user is in trial and has no marketing info', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'trial', status: AccountStatus.TRIAL }),
    );
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: { id: 'trial', name: 'trial' },
        desiredContent: undefined,
        audience: undefined,
      }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/videos']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText(
        "You've just been added to Boclips by your colleague",
      ),
    ).toBeVisible();
  });
  it('/welcome should redirect to home if user is in trial and has marketing info', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'trial', status: AccountStatus.TRIAL }),
    );
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: { id: 'trial', name: 'trial' },
        desiredContent: 'videos',
        audience: 'everyone',
        jobTitle: 'CEO',
      }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/welcome']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to CourseSpark!',
    );
  });
  it('/welcome should redirect to home if user is not in trial', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'regular', status: AccountStatus.ACTIVE }),
    );
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: { id: 'regular', name: 'no trial' },
        desiredContent: 'videos',
        audience: 'everyone',
      }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/welcome']}>
        <App boclipsSecurity={stubBoclipsSecurity} apiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to CourseSpark!',
    );
  });
});
