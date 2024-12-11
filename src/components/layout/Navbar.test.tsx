import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from '@src/testSupport/render';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import NavbarResponsive from '@components/layout/Navbar';
import { waitFor } from '@testing-library/react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  resizeToDesktop,
  resizeToMobile,
  resizeToTablet,
} from '@src/testSupport/resizeTo';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import {
  AccountStatus,
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';

describe(`Navbar`, () => {
  describe('Skip to main content button', () => {
    it.each([
      ['desktop', resizeToDesktop],
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])(
      'is in document on %s',
      async (_screenType: string, resize: () => void) => {
        resize();

        const wrapper = render(
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <BoclipsClientProvider client={new FakeBoclipsClient()}>
              <NavbarResponsive />
            </BoclipsClientProvider>
          </BoclipsSecurityProvider>,
        );

        expect(
          await wrapper.findByTestId('skip_to_content'),
        ).toBeInTheDocument();
      },
    );
  });

  describe('Menu Hamburger button', () => {
    const client = new FakeBoclipsClient();
    let wrapper;

    beforeEach(() => {
      client.users.insertCurrentUser(
        UserFactory.sample({
          firstName: 'Ricky',
          lastName: 'Julian',
          email: 'sunnyvale@swearnet.com',
        }),
      );

      wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])(
      'opens menu on click on %s',
      async (_screenType: string, resize: () => void) => {
        resize();

        await userEvent.click(await wrapper.findByLabelText('Menu'));

        expect(wrapper.getByText('Order History')).toBeInTheDocument();
        expect(wrapper.getByText('Cart')).toBeInTheDocument();
        expect(wrapper.getByText('Platform guide')).toBeInTheDocument();
        expect(wrapper.getByText('Log out')).toBeInTheDocument();
      },
    );

    it('is not visible on desktop', async () => {
      resizeToDesktop();

      await waitFor(() =>
        expect(wrapper.queryByLabelText('Menu')).not.toBeInTheDocument(),
      );
    });
  });

  describe('Platform guide link for Classroom', () => {
    const client = new FakeBoclipsClient();
    let wrapper;

    beforeEach(() => {
      client.users.insertCurrentUser(
        UserFactory.sample({
          firstName: 'Ricky',
          lastName: 'Julian',
          email: 'sunnyvale@swearnet.com',
          account: {
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'classroom account',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
          },
        }),
      );

      wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])(
      'is not visible for classroom user %s',
      async (_screenType: string, resize: () => void) => {
        resize();

        await userEvent.click(await wrapper.findByLabelText('Menu'));

        expect(wrapper.queryByText('Platform guide')).not.toBeInTheDocument();
      },
    );
  });

  describe('Search bar', () => {
    it.each([
      ['desktop', resizeToDesktop],
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])('is visible on %s', async (_screenType: string, resize: () => void) => {
      resize();

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(wrapper.getByPlaceholderText('Search for videos')).toBeVisible();
    });

    it(`search bar hidden when disabled`, () => {
      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <NavbarResponsive showSearch={false} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(wrapper.queryByPlaceholderText('Search for videos')).toBeNull();
    });
  });

  describe('Playlists in Navbar', () => {
    const client = new FakeBoclipsClient();
    let wrapper;

    beforeEach(() => {
      client.users.insertCurrentUser(UserFactory.sample());

      wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    });

    it('is visible on desktop', async () => {
      resizeToDesktop();

      expect(
        await wrapper.findByRole('button', {
          name: 'Playlists find your playlists here',
        }),
      ).toBeVisible();
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])('is visible on %s', async (_screenType: string, resize: () => void) => {
      resize();

      await userEvent.click(await wrapper.findByLabelText('Menu'));
      expect(wrapper.getByText('Playlists')).toBeVisible();
    });
  });

  describe('Alignments option in Navbar', () => {
    const client = new FakeBoclipsClient();
    let wrapper;

    beforeEach(() => {
      wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    });

    it(`will show the Alignments menu option on desktop`, async () => {
      resizeToDesktop();

      expect(
        await wrapper.findByRole('button', { name: 'Alignments' }),
      ).toBeVisible();
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])(
      'will show the Alignments menu option on %s',
      async (_screenType: string, resize: () => void) => {
        resize();

        await userEvent.click(await wrapper.findByLabelText('Menu'));

        expect(wrapper.getByText('Alignments')).toBeVisible();
      },
    );
  });

  describe('Profile in Navbar - mobile', () => {
    const client = new FakeBoclipsClient();
    let wrapper;

    beforeEach(() => {
      client.users.insertCurrentUser(UserFactory.sample());

      wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])('is visible on %s', async (_screenType: string, resize: () => void) => {
      resize();

      await userEvent.click(await wrapper.findByLabelText('Menu'));
      expect(wrapper.getByText('Profile')).toBeVisible();
    });
  });

  describe('Home in Navbar - mobile', () => {
    const client = new FakeBoclipsClient();
    let wrapper;

    beforeEach(() => {
      client.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            name: 'Footballers',
            id: 'id',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
          },
        }),
      );

      wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])('is visible on %s', async (_screenType: string, resize: () => void) => {
      resize();

      await userEvent.click(await wrapper.findByLabelText('Menu'));
      expect(wrapper.getByText('Home')).toBeVisible();
    });
  });

  describe('All videos in Navbar - mobile', () => {
    const client = new FakeBoclipsClient();
    let wrapper;

    beforeEach(() => {
      client.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            name: 'Footballers',
            id: 'id',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
          },
        }),
      );

      wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])('is visible on %s', async (_screenType: string, resize: () => void) => {
      resize();

      await userEvent.click(await wrapper.findByLabelText('Menu'));
      expect(wrapper.getByText('All videos')).toBeVisible();
    });
  });

  describe('Show Options', () => {
    it('should hide options if requested', () => {
      resizeToDesktop();

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <NavbarResponsive showOptions={false} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(wrapper.queryByRole('button', { name: 'Home Home' })).toBeNull();
      expect(wrapper.queryByRole('button', { name: 'All videos' })).toBeNull();
    });

    it('shows options by default', () => {
      resizeToDesktop();

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(wrapper.getByRole('button', { name: 'Home Home' })).toBeVisible();
      expect(wrapper.getByRole('button', { name: 'All videos' })).toBeVisible();
    });

    it('does not show hamburger menu if options should be hidden on mobile', () => {
      resizeToMobile();

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <NavbarResponsive showOptions={false} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(wrapper.queryByLabelText('Menu')).toBeNull();
    });
  });

  describe(`trial banner`, () => {
    it(`renders the trial banner of trial users`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.accounts.insertAccount(
        AccountsFactory.sample({
          type: AccountType.TRIAL,
          status: AccountStatus.ACTIVE,
          id: 'trial',
        }),
      );
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'trial',
            name: 'trial account',
            type: AccountType.TRIAL,
          },
        }),
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <NavbarResponsive showOptions={false} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(await wrapper.findByTestId('trial-banner')).toBeVisible();
      expect(await wrapper.findByTestId('trial-banner')).toHaveTextContent(
        "Welcome! You're currently exploring Boclips Library. Need more info? Click here or connect with our sales team",
      );
    });

    it(`does not render the trial banner for non trial users`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.accounts.insertAccount(
        AccountsFactory.sample({
          type: AccountType.STANDARD,
          status: AccountStatus.ACTIVE,
          id: 'non-trial',
        }),
      );
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'non-trial',
            name: 'regular account',
            type: AccountType.STANDARD,
          },
        }),
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <NavbarResponsive showOptions={false} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(wrapper.queryByTestId('trial-banner')).toBeNull();
    });

    it(`does not render the trial banner for trial classroom users`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.accounts.insertAccount(
        AccountsFactory.sample({
          type: AccountType.TRIAL,
          status: AccountStatus.ACTIVE,
          id: 'trial',
          products: [Product.CLASSROOM],
        }),
      );
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'trial',
            name: 'classroom account',
            type: AccountType.TRIAL,
            products: [Product.CLASSROOM],
          },
        }),
      );

      const wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={fakeClient}>
            <NavbarResponsive showOptions={false} />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      expect(wrapper.queryByTestId('trial-banner')).toBeNull();
    });
  });
});
