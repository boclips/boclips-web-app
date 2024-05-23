import { fireEvent, render, waitFor } from '@testing-library/react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import React from 'react';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Constants } from 'src/AppConstants';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import NavbarResponsive from 'src/components/layout/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe(`Navbar test`, () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);

    fakeClient = new FakeBoclipsClient();
    fakeClient.users.clear();
  });

  const renderAccountButton = () =>
    render(
      <Router>
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <QueryClientProvider client={new QueryClient()}>
            <BoclipsClientProvider client={fakeClient}>
              <NavbarResponsive />
            </BoclipsClientProvider>
          </QueryClientProvider>
        </BoclipsSecurityProvider>
      </Router>,
    );

  it(`text is Account if name is blank`, async () => {
    fakeClient.users.insertCurrentUser(UserFactory.sample({ firstName: ' ' }));
    const wrapper = renderAccountButton();

    expect(await wrapper.findByText('Account')).toBeInTheDocument();
  });
  let fakeClient: FakeBoclipsClient;

  it('opens the tooltip when clicked and close the tooltip when clicked on the body', async () => {
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'Eddie',
        lastName: 'Bravo',
        email: 'eddie@10thplanetjj.com',
        features: { BO_WEB_APP_DEV: true },
      }),
    );
    const navbar = renderAccountButton();

    fireEvent.click(await navbar.findByText('Eddie'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    await waitFor(() => {
      expect(navbar.getByText('Account')).toBeInTheDocument();
      expect(navbar.getByText('Order History')).toBeInTheDocument();
      expect(navbar.getByText('Platform guide')).toBeInTheDocument();
      expect(navbar.getByText('My team')).toBeInTheDocument();
      expect(navbar.getByText('Log out')).toBeInTheDocument();
    });
  });

  it('does not show platform guide for classroom', async () => {
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
      }),
    );
    const navbar = renderAccountButton();

    fireEvent.click(await navbar.findByText('Eddie'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    await waitFor(() =>
      expect(navbar.queryByText('Platform guide')).not.toBeInTheDocument(),
    );
  });

  it('does not contain my orders link in tooltip when user does not have userOrders link', async () => {
    const user = UserFactory.sample({
      id: '123',
      firstName: 'yo',
      lastName: 'yo',
      email: 'yoyo@ma.com',
    });
    fakeClient.users.insertCurrentUser(user);
    fakeClient.links.userOrders = null;

    const wrapper = renderAccountButton();
    expect(await wrapper.findByText('yo')).toBeInTheDocument();

    fireEvent.click(await wrapper.findByText('yo'));

    await waitFor(() => wrapper.getByTestId('account-modal'));

    await waitFor(() => {
      expect(wrapper.queryByText('Order History')).toBeNull();
      expect(wrapper.getByText('Log out')).toBeInTheDocument();
    });
  });

  it('does not contain your content link in tooltip when user does not have BWA_DEV feature enabled', async () => {
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'yo',
        features: { BO_WEB_APP_DEV: false },
      }),
    );

    const wrapper = renderAccountButton();
    expect(await wrapper.findByText('yo')).toBeInTheDocument();

    fireEvent.click(await wrapper.findByText('yo'));

    await waitFor(() => wrapper.getByTestId('account-modal'));

    await waitFor(() => {
      expect(wrapper.queryByText('My content')).toBeNull();
      expect(wrapper.getByText('Log out')).toBeInTheDocument();
    });
  });

  it('contains your content link in tooltip when user has BWA_DEV feature enabled', async () => {
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'yo',
        features: { BO_WEB_APP_DEV: true },
      }),
    );

    const wrapper = renderAccountButton();
    expect(await wrapper.findByText('yo')).toBeInTheDocument();

    fireEvent.click(await wrapper.findByText('yo'));

    await waitFor(() => wrapper.getByTestId('account-modal'));

    await waitFor(() => {
      expect(wrapper.getByText('My content')).toBeInTheDocument();
    });
  });
  /**
   * I'm not sure this actually tests anything.
   * Ideally we'd test that we'd actually get back to the home page, somehow.
   */
  it('redirects to / on logout', async () => {
    const user = UserFactory.sample({ firstName: 'Frank' });
    fakeClient.users.insertCurrentUser(user);

    const wrapper = renderAccountButton();

    fireEvent.click(await wrapper.findByText('Frank'));

    fireEvent.click(await wrapper.findByText('Log out'));

    expect(stubBoclipsSecurity.logout).toHaveBeenCalledWith({
      redirectUri: `${Constants.HOST}/`,
    });
  });

  it('closes the dialog on esc', async () => {
    const user = UserFactory.sample({ firstName: 'Frank' });
    fakeClient.users.insertCurrentUser(user);
    const navbar = renderAccountButton();

    expect(await navbar.findByText('Frank')).toBeInTheDocument();

    fireEvent.click(await navbar.findByText('Frank'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    fireEvent.keyDown(navbar.getByTestId('account-modal'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });

    expect(navbar.queryByTestId('account-modal')).not.toBeInTheDocument();
  });

  it('closes the dialog when the dialog loses focus', async () => {
    const user = UserFactory.sample({ firstName: 'Frank' });
    fakeClient.users.insertCurrentUser(user);
    const navbar = renderAccountButton();

    expect(await navbar.findByText('Frank')).toBeInTheDocument();

    fireEvent.click(await navbar.findByText('Frank'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    fireEvent.blur(navbar.getByText('Log out'));

    expect(navbar.queryByText('Log out')).not.toBeInTheDocument();
  });

  it('does not close the dialog when a child gains focus', async () => {
    const user = UserFactory.sample({ firstName: 'Frank' });
    fakeClient.users.insertCurrentUser(user);
    const navbar = renderAccountButton();

    expect(await navbar.findByText('Frank')).toBeVisible();

    fireEvent.click(await navbar.findByText('Frank'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    fireEvent.focus(navbar.getByText('Log out'));

    expect(navbar.getByText('Log out')).toBeVisible();
  });

  it('shows unique access code for classroom user', async () => {
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
    const navbar = renderAccountButton();

    fireEvent.click(await navbar.findByText('Eddie'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    expect(
      navbar.getByLabelText('Your unique access code is 12AB'),
    ).toBeVisible();
    expect(navbar.getByText('Unique access code')).toBeVisible();
    expect(navbar.getByText('12AB')).toBeVisible();

    expect(
      navbar.getByLabelText('Free access until 13 April 2024'),
    ).toBeVisible();

    expect(navbar.getByText('Free access until')).toBeVisible();
    expect(navbar.getByText('13 April 2024')).toBeVisible();
  });

  it('does not show unique access code for non-classroom user', async () => {
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
    const navbar = renderAccountButton();

    fireEvent.click(await navbar.findByText('Eddie'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    expect(
      navbar.queryByLabelText('Your unique access code is 12AB'),
    ).toBeNull();
    expect(navbar.queryByText('Unique access code')).toBeNull();
    expect(navbar.queryByText('12AB')).toBeNull();

    expect(navbar.queryByText('Free access until 04 April 2024')).toBeNull();
    expect(navbar.queryByText('Free access until')).toBeNull();
    expect(navbar.queryByText('04 April 2024')).toBeNull();
  });
});
