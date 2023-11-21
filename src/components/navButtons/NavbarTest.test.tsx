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

  it(`text is my account if name is blank`, async () => {
    fakeClient.users.insertCurrentUser(UserFactory.sample({ firstName: ' ' }));
    const wrapper = renderAccountButton();

    expect(await wrapper.findByText('My Account')).toBeInTheDocument();
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
      expect(navbar.getByText('Eddie Bravo')).toBeInTheDocument();
      expect(navbar.getByText('eddie@10thplanetjj.com')).toBeInTheDocument();
      expect(navbar.getByText('My account')).toBeInTheDocument();
      expect(navbar.getByText('My orders')).toBeInTheDocument();
      expect(navbar.getByText('Platform guide')).toBeInTheDocument();
      expect(navbar.getByText('My team')).toBeInTheDocument();
      expect(navbar.getByText('Log out')).toBeInTheDocument();
    });
  });

  it('does not show My account page link when BO_WEB_APP_DEV disabled', async () => {
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'Eddie',
        lastName: 'Bravo',
        email: 'eddie@10thplanetjj.com',
        features: { BO_WEB_APP_DEV: false },
      }),
    );
    const navbar = renderAccountButton();

    fireEvent.click(await navbar.findByText('Eddie'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    await waitFor(() => {
      expect(navbar.queryByText('My account')).not.toBeInTheDocument();
    });
  });

  it('does not contain your orders link in tooltip when user does not have userOrders link', async () => {
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
      expect(wrapper.getByText('yo yo')).toBeInTheDocument();
      expect(wrapper.getByText('yoyo@ma.com')).toBeInTheDocument();
      expect(wrapper.queryByText('My orders')).toBeNull();
      expect(wrapper.getByText('Log out')).toBeInTheDocument();
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
});
