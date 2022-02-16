import { fireEvent, waitFor } from '@testing-library/react';
import Navbar from 'src/components/layout/Navbar';
import React from 'react';
import { render } from 'src/testSupport/render';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { Constants } from 'src/AppConstants';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';

describe('account button', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('opens the tooltip when clicked and close the tooltip when clicked on the body', async () => {
    const fakeClient = new FakeBoclipsClient();
    const user = {
      id: '123',
      firstName: 'Eddie',
      lastName: 'Bravo',
      email: 'eddie@10thplanetjj.com',
      features: {
        LTI_COPY_RESOURCE_LINK: true,
      },
      organisation: {
        id: '321',
        name: '10th planet jj',
      },
    };

    fakeClient.users.insertCurrentUser(user);

    const navbar = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <Navbar />
        </BoclipsClientProvider>
        ,
      </BoclipsSecurityProvider>,
    );

    expect(await navbar.findByText('Account')).toBeInTheDocument();

    fireEvent.click(navbar.getByText('Account'));

    await waitFor(() => {
      expect(navbar.getByText('Eddie Bravo')).toBeInTheDocument();
      expect(navbar.getByText('eddie@10thplanetjj.com')).toBeInTheDocument();
      expect(navbar.getByText('Your orders')).toBeInTheDocument();
      expect(navbar.getByText('Log out')).toBeInTheDocument();
    });
  });

  it('does not contain your orders link in tooltip when user does not have userOrders link', async () => {
    const fakeClient = new FakeBoclipsClient();
    const user = UserFactory.sample({
      id: '123',
      firstName: 'yo',
      lastName: 'yo',
      email: 'yoyo@ma.com',
    });
    fakeClient.users.insertCurrentUser(user);
    fakeClient.links.userOrders = null;

    const navbar = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <Navbar />
        </BoclipsClientProvider>
        ,
      </BoclipsSecurityProvider>,
    );

    expect(await navbar.findByText('Account')).toBeInTheDocument();

    fireEvent.click(navbar.getByText('Account'));

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
    const fakeClient = new FakeBoclipsClient();

    fakeClient.users.insertCurrentUser(UserFactory.sample());

    const wrapper = render(
      <MemoryRouter initialEntries={['/cart']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    fireEvent.click(await wrapper.findByText('Account'));

    fireEvent.click(await wrapper.findByText('Log out'));

    expect(stubBoclipsSecurity.logout).toHaveBeenCalledWith({
      redirectUri: `${Constants.HOST}/`,
    });
  });

  it('closes the dialog on esc', async () => {
    const fakeClient = new FakeBoclipsClient();
    const user = {
      id: '123',
      firstName: 'Eddie',
      lastName: 'Bravo',
      email: 'eddie@10thplanetjj.com',
      features: {
        LTI_COPY_RESOURCE_LINK: true,
      },
      organisation: {
        id: '321',
        name: '10th planet jj',
      },
    };

    fakeClient.users.insertCurrentUser(user);

    const navbar = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <Navbar />
        </BoclipsClientProvider>
        ,
      </BoclipsSecurityProvider>,
    );

    expect(await navbar.findByText('Account')).toBeInTheDocument();

    fireEvent.click(navbar.getByText('Account'));
    userEvent.type(navbar.getByText('Log out'), '{esc}');

    expect(navbar.queryByText('Log out')).not.toBeInTheDocument();
  });
});
