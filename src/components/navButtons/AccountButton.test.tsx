import { fireEvent, waitFor } from '@testing-library/react';
import Navbar from 'src/components/layout/Navbar';
import React from 'react';
import { render } from 'src/testSupport/render';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { Constants } from 'src/AppConstants';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';

describe('account button', () => {
  let fakeClient: FakeBoclipsClient;

  beforeEach(() => {
    window.resizeTo(1680, 1024);

    fakeClient = new FakeBoclipsClient();
  });

  const renderAccountButton = () =>
    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <Navbar />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

  it('opens the tooltip when clicked and close the tooltip when clicked on the body', async () => {
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'Eddie',
        lastName: 'Bravo',
        email: 'eddie@10thplanetjj.com',
      }),
    );

    const navbar = renderAccountButton();

    fireEvent.click(navbar.getByText('Account'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    await waitFor(() => {
      expect(navbar.getByText('Eddie Bravo')).toBeInTheDocument();
      expect(navbar.getByText('eddie@10thplanetjj.com')).toBeInTheDocument();
      expect(navbar.getByText('Your orders')).toBeInTheDocument();
      expect(navbar.getByText('Platform guide')).toBeInTheDocument();
      expect(navbar.getByText('Log out')).toBeInTheDocument();
    });
  });

  it('does not contain your orders link in tooltip when user does not have userOrders link', async () => {
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        id: '123',
        firstName: 'yo',
        lastName: 'yo',
        email: 'yoyo@ma.com',
      }),
    );
    fakeClient.links.userOrders = null;

    const navbar = renderAccountButton();

    expect(await navbar.findByText('Account')).toBeInTheDocument();

    fireEvent.click(navbar.getByText('Account'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    await waitFor(() => {
      expect(navbar.getByText('yo yo')).toBeInTheDocument();
      expect(navbar.getByText('yoyo@ma.com')).toBeInTheDocument();
      expect(navbar.queryByText('Your orders')).toBeNull();
      expect(navbar.getByText('Log out')).toBeInTheDocument();
    });
  });

  /**
   * I'm not sure this actually tests anything.
   * Ideally we'd test that we'd actually get back to the home page, somehow.
   */
  it('redirects to / on logout', async () => {
    fakeClient.users.insertCurrentUser(UserFactory.sample());

    const wrapper = renderAccountButton();

    fireEvent.click(await wrapper.findByText('Account'));

    fireEvent.click(await wrapper.findByText('Log out'));

    expect(stubBoclipsSecurity.logout).toHaveBeenCalledWith({
      redirectUri: `${Constants.HOST}/`,
    });
  });

  it('closes the dialog on esc', async () => {
    fakeClient.users.insertCurrentUser(UserFactory.sample());
    const navbar = renderAccountButton();

    expect(await navbar.findByText('Account')).toBeInTheDocument();

    fireEvent.click(navbar.getByText('Account'));

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
    fakeClient.users.insertCurrentUser(UserFactory.sample());
    const navbar = renderAccountButton();

    expect(await navbar.findByText('Account')).toBeInTheDocument();

    fireEvent.click(navbar.getByText('Account'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    fireEvent.blur(navbar.getByText('Log out'));

    expect(navbar.queryByText('Log out')).not.toBeInTheDocument();
  });

  it('does not close the dialog when a child gains focus', async () => {
    fakeClient.users.insertCurrentUser(UserFactory.sample());
    const navbar = renderAccountButton();

    expect(await navbar.findByText('Account')).toBeVisible();

    fireEvent.click(navbar.getByText('Account'));

    await waitFor(() => navbar.getByTestId('account-modal'));

    fireEvent.focus(navbar.getByText('Log out'));

    expect(navbar.getByText('Log out')).toBeVisible();
  });
});
