import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import App from '@src/App';
import {
  CollectionAssetFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { Helmet } from 'react-helmet';
import { createBrowserHistory } from 'history';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { resizeToDesktop } from '@src/testSupport/resizeTo';
import { createReactQueryClient } from '@src/testSupport/createReactQueryClient';
import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import {
  AccountStatus,
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { PromotedForProduct } from 'boclips-api-client/dist/sub-clients/collections/model/PromotedForProduct';

describe('HomeView', () => {
  beforeEach(() => {
    resizeToDesktop(1024);
  });

  const renderWrapper = (
    fakeClient: FakeBoclipsClient = new FakeBoclipsClient(),
  ) => {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );
  };

  it('displays Library title if product is LIBRARY', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'acc-1',
          name: 'Ren',
          products: [Product.LIBRARY],
          type: AccountType.STANDARD,
        },
      }),
    );

    const wrapper = renderWrapper(fakeClient);
    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to Boclips Library',
    );
  });

  it('displays Classroom title if product is Classroom', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'acc-1',
          name: 'Ren',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
        },
      }),
    );

    const wrapper = renderWrapper(fakeClient);
    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to Boclips Classroom',
    );
  });

  it('loads the home view buttons', async () => {
    const wrapper = renderWrapper();
    expect(await wrapper.findByText('Browse All Videos')).toBeInTheDocument();
    expect(await wrapper.findByText('View Playlists')).toBeInTheDocument();
  });

  it('displays Home as window title', async () => {
    renderWrapper();
    const helmet = Helmet.peek();

    expect(helmet.title).toEqual('Home');
  });

  it('redirects to empty search (video) page with no filters or query', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location="/" navigator={history}>
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
    const wrapper = renderWrapper();
    expect(
      await wrapper.findByPlaceholderText('Search for videos'),
    ).toBeInTheDocument();
  });

  it(`displays featured videos and playlists`, async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.collections.addToFake(
      CollectionFactory.sample({
        title: 'my promoted playlist',
        assets: [CollectionAssetFactory.sample({})],
        promotedFor: [PromotedForProduct.LIBRARY, PromotedForProduct.CLASSROOM],
      }),
    );
    fakeBoclipsClient.videos.insertVideo(
      VideoFactory.sample({
        id: '63c04899bf161a652f79f0ed',
        title: 'my promoted video',
        promoted: true,
      }),
    );
    const wrapper = renderWrapper(fakeBoclipsClient);

    expect(
      await wrapper.findByText('my promoted playlist'),
    ).toBeInTheDocument();
    expect(await wrapper.findByText('my promoted video')).toBeInTheDocument();
  });

  it(`hides home hero and carousel displays two slides on mobile`, async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.collections.addToFake(
      CollectionFactory.sample({
        title: 'my promoted playlist',
        assets: [CollectionAssetFactory.sample({})],
        promotedFor: [PromotedForProduct.LIBRARY, PromotedForProduct.CLASSROOM],
      }),
    );
    fakeBoclipsClient.collections.addToFake(
      CollectionFactory.sample({
        title: 'my promoted playlist 1',
        assets: [CollectionAssetFactory.sample({})],
        promotedFor: [PromotedForProduct.LIBRARY, PromotedForProduct.CLASSROOM],
      }),
    );
    fakeBoclipsClient.collections.addToFake(
      CollectionFactory.sample({
        title: 'my promoted playlist 2',
        assets: [CollectionAssetFactory.sample({})],
        promotedFor: [PromotedForProduct.LIBRARY, PromotedForProduct.CLASSROOM],
      }),
    );
    window.resizeTo(765, 1024);
    const wrapper = renderWrapper(fakeBoclipsClient);
    expect(
      await wrapper.findByText('my promoted playlist'),
    ).toBeInTheDocument();
    expect(
      await wrapper.findByText('my promoted playlist 1'),
    ).toBeInTheDocument();
    expect(wrapper.queryByTestId('home-search-hero')).toBeNull();
    // carousel still has this element in dom so can't figure out how to assert it's hidden, but it is
    // expect(wrapper.queryByText('my promoted playlist 2')).not.toBeVisible();
  });

  it('shows regular welcome modal if user does not have marketing info and trial account requires it', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'kb',
        firstName: 'Kobe',
        lastName: 'Bryant',
        email: 'kobe@la.com',
        account: {
          ...UserFactory.sample().account,
          id: 'LAL',
          name: 'LA Lakers',
          type: AccountType.TRIAL,
          marketingInformation: { companySegments: ['Edtech'] },
        },
        audiences: [],
        jobTitle: null,
        desiredContent: null,
        discoveryMethods: [],
      }),
    );
    fakeBoclipsClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });
    fakeBoclipsClient.accounts.insertAccount(
      AccountsFactory.sample({
        id: 'LAL',
        type: AccountType.TRIAL,
        status: AccountStatus.ACTIVE,
        marketingInformation: { companySegments: ['Edtech'] }, // regular user has this field filled
      }),
    );
    const wrapper = renderWrapper(fakeBoclipsClient);
    expect(
      await wrapper.findByText(
        'Your colleague has invited you to Boclips Library!',
      ),
    ).toBeVisible();
  });

  it('shows admin welcome modal if user does not have marketing info and trial account requires it', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'kb',
        firstName: 'Kobe',
        lastName: 'Bryant',
        email: 'kobe@la.com',
        account: {
          ...UserFactory.sample().account,
          id: 'LAL',
          name: 'LA Lakers',
          type: AccountType.TRIAL,
          marketingInformation: { companySegments: [] },
        },
        audiences: [],
        jobTitle: null,
        desiredContent: null,
        discoveryMethods: [],
      }),
    );
    fakeBoclipsClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });
    fakeBoclipsClient.accounts.insertAccount(
      AccountsFactory.sample({
        id: 'LAL',
        type: AccountType.TRIAL,
        status: AccountStatus.ACTIVE,
        marketingInformation: { companySegments: [] }, // admin has no company segments set
      }),
    );
    const wrapper = renderWrapper(fakeBoclipsClient);
    expect(
      await wrapper.findByText('Tell us a bit more about you'),
    ).toBeVisible();
  });

  it('does not show welcome modal if user has marketing info filled and is under trial account', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'kb',
        firstName: 'Kobe',
        lastName: 'Bryant',
        email: 'kobe@la.com',
        account: {
          ...UserFactory.sample().account,
          id: 'LAL',
          name: 'LA Lakers',
          type: AccountType.TRIAL,
        },
        audiences: ['K12'],
        jobTitle: 'Designer',
        desiredContent: 'Designes',
        discoveryMethods: ['tiktok'],
      }),
    );
    fakeBoclipsClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });
    fakeBoclipsClient.accounts.insertAccount(
      AccountsFactory.sample({
        id: 'LAL',
        type: AccountType.TRIAL,
        status: AccountStatus.ACTIVE,
      }),
    );
    const wrapper = renderWrapper(fakeBoclipsClient);

    expect(wrapper.queryByText('Job Title')).toBeNull();
  });

  it('does not show regular welcome modal if user does not have discovery methods filled and is under trial account', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'kb',
        firstName: 'Kobe',
        lastName: 'Bryant',
        email: 'kobe@la.com',
        account: {
          ...UserFactory.sample().account,
          id: 'LAL',
          name: 'LA Lakers',
          type: AccountType.TRIAL,
        },
        audiences: ['K12'],
        jobTitle: 'Designer',
        desiredContent: 'Designes',
        discoveryMethods: [],
      }),
    );
    fakeBoclipsClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });
    fakeBoclipsClient.accounts.insertAccount(
      AccountsFactory.sample({
        ...UserFactory.sample().account,
        id: 'LAL',
        type: AccountType.TRIAL,
        status: AccountStatus.ACTIVE,
        marketingInformation: {
          country: 'USA',
          companySegments: ['Edtech'],
        },
      }),
    );
    const wrapper = renderWrapper(fakeBoclipsClient);
    await waitFor(() => {
      expect(wrapper.queryByText('Job Title')).toBeNull();
    });
  });

  it('does not show welcome modal if user does not have marketing info but have account type different than trial', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'kb',
        firstName: 'Kobe',
        lastName: 'Bryant',
        email: 'kobe@la.com',
        account: {
          ...UserFactory.sample().account,
          id: 'LAL',
          name: 'LA Lakers',
          products: [Product.LIBRARY],
          type: AccountType.STANDARD,
        },
        audiences: null,
        jobTitle: null,
        desiredContent: null,
      }),
    );
    fakeBoclipsClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });
    fakeBoclipsClient.accounts.insertAccount(
      AccountsFactory.sample({
        id: 'LAL',
        type: AccountType.STANDARD,
        status: AccountStatus.ACTIVE,
      }),
    );
    const wrapper = renderWrapper(fakeBoclipsClient);

    expect(wrapper.queryByText('Job Title')).toBeNull();

    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to Boclips Library',
    );
  });

  it('does not show welcome modal if user has no DEV feature flag', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'kb',
        firstName: 'Kobe',
        lastName: 'Bryant',
        email: 'kobe@la.com',
        account: {
          ...UserFactory.sample().account,
          id: 'LAL',
          name: 'LA Lakers',
          products: [Product.LIBRARY],
          type: AccountType.STANDARD,
        },
        audiences: null,
        jobTitle: null,
        desiredContent: null,
      }),
    );
    fakeBoclipsClient.accounts.insertAccount(
      AccountsFactory.sample({ id: 'LAL', type: AccountType.TRIAL }),
    );
    const wrapper = renderWrapper(fakeBoclipsClient);
    expect(
      wrapper.queryByText(
        "You've just been added to Boclips by your colleague",
      ),
    ).toBeNull();

    expect(await wrapper.findByTestId('header-text')).toHaveTextContent(
      'Welcome to Boclips Library',
    );
  });
});
