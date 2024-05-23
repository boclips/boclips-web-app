import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import SideMenu from 'src/components/layout/SideMenu';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { AdminLinksFactory } from 'boclips-api-client/dist/test-support/AdminLinksFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('Side Menu', () => {
  it('displays Home, All Videos, Account, Alignments and Playlist buttons', () => {
    const wrapper = renderSideMenu();

    expect(wrapper.getByRole('link', { name: 'Home' })).toBeVisible();
    expect(wrapper.getByRole('link', { name: 'All videos' })).toBeVisible();
    expect(wrapper.getByRole('link', { name: 'Profile' })).toBeVisible();
    expect(wrapper.getByRole('link', { name: 'Alignments' })).toBeVisible();
    expect(wrapper.getByRole('link', { name: 'Playlists' })).toBeVisible();
    expect(wrapper.getByRole('button', { name: 'Log out' })).toBeVisible();
  });

  it(`displays cart when user has link`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.links = AdminLinksFactory.sample({ cart: { href: '/cart' } });
    const wrapper = renderSideMenu(fakeClient);

    expect(await wrapper.findByRole('link', { name: 'Cart' })).toBeVisible();
  });

  it(`displays orders when user has link`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.links = AdminLinksFactory.sample({
      userOrders: { href: '/orders' },
    });
    const wrapper = renderSideMenu(fakeClient);

    expect(
      await wrapper.findByRole('link', { name: 'Order History' }),
    ).toBeVisible();
  });

  it(`displays Team when user has link`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.links = AdminLinksFactory.sample({
      updateUser: { href: '/team' },
    });
    const wrapper = renderSideMenu(fakeClient);

    expect(await wrapper.findByRole('link', { name: 'Team' })).toBeVisible();
  });

  it(`displays platform guide when user has product B2B`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          id: 'acc-1',
          type: AccountType.STANDARD,
          products: [Product.B2B],
          name: 'Account',
          createdAt: new Date(),
        },
      }),
    );
    const wrapper = renderSideMenu(fakeClient);

    expect(
      await wrapper.findByRole('link', { name: 'Platform guide' }),
    ).toBeVisible();
  });

  it(`displays Licenses`, async () => {
    const wrapper = renderSideMenu(new FakeBoclipsClient());

    expect(
      await wrapper.findByRole('link', { name: 'Licenses' }),
    ).toBeVisible();
  });

  it('shows unique access code for classroom user', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'Eddie',
        lastName: 'Bravo',
        email: 'eddie@10thplanetjj.com',
        account: {
          ...UserFactory.sample().account,
          id: 'acc-1',
          name: 'Ren',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
        },
        shareCode: '12AB',
        accessExpiresOn: new Date('2024-04-13'),
      }),
    );
    const navbar = renderSideMenu(fakeClient);

    expect(await navbar.findByText('Unique access code')).toBeVisible();
    expect(navbar.getByText('12AB')).toBeVisible();

    expect(navbar.getByText('Free access until')).toBeVisible();
    expect(navbar.getByText('13 April 2024')).toBeVisible();
  });

  it('does not show unique access code for non-classroom user', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'Eddie',
        lastName: 'Bravo',
        email: 'eddie@10thplanetjj.com',
        account: {
          ...UserFactory.sample().account,
          id: 'acc-1',
          name: 'Ren',
          products: [Product.B2B],
          type: AccountType.STANDARD,
        },
        shareCode: '12AB',
        accessExpiresOn: new Date('2024-04-04T10:04:31.362Z'),
      }),
    );
    const navbar = renderSideMenu(fakeClient);

    expect(navbar.queryByText('Unique access code')).toBeNull();
    expect(navbar.queryByText('12AB')).toBeNull();

    expect(navbar.queryByText('Free access until')).toBeNull();
    expect(navbar.queryByText('04 April 2024')).toBeNull();
  });

  const renderSideMenu = (fakeClient = new FakeBoclipsClient()) => {
    return render(
      <BrowserRouter>
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <QueryClientProvider client={new QueryClient()}>
              <SideMenu hasSearchInNavbar={false} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>
      </BrowserRouter>,
    );
  };
});
