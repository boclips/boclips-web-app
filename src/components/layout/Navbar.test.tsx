import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from 'src/testSupport/render';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import NavbarResponsive from 'src/components/layout/Navbar';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';

describe('Desktop & Mobile - Navbar', () => {
  it('does renders the search bar by default', async () => {
    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <NavbarResponsive />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(
      await screen.getByPlaceholderText('Search for videos'),
    ).toBeVisible();
  });

  it('renders skip to main content button', async () => {
    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <NavbarResponsive />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(await wrapper.findByTestId('skip_to_content')).toBeInTheDocument();
  });

  it(`renders the explore button if user has openstax feature`, async () => {
    window.resizeTo(1200, 1024);
    const fakeApiClient = new FakeBoclipsClient();

    fakeApiClient.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeApiClient}>
          <NavbarResponsive />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(
      await wrapper.findByRole('button', { name: 'Explore' }),
    ).toBeVisible();
  });

  it(`doesn't render the explore button if doesn't user have openstax feature`, async () => {
    window.resizeTo(1200, 1024);
    const fakeApiClient = new FakeBoclipsClient();

    fakeApiClient.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: false });

    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeApiClient}>
          <NavbarResponsive />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(await wrapper.queryByRole('button', { name: 'Explore' })).toBeNull();
  });
});

describe('Mobile - Navbar', () => {
  beforeEach(() => {
    window.resizeTo(768, 1024);
  });

  it('opens menu on hamburger click', async () => {
    const client = new FakeBoclipsClient();

    client.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'Ricky',
        lastName: 'Julian',
        email: 'sunnyvale@swearnet.com',
      }),
    );

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <NavbarResponsive />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    fireEvent.click(await screen.findByTestId('side-menu'));

    expect(screen.getByText('Ricky Julian')).toBeInTheDocument();
    expect(screen.getByText('sunnyvale@swearnet.com')).toBeInTheDocument();
    expect(screen.getByText('Your orders')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Platform guide')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('closes the menu on hamburger click', async () => {
    const client = new FakeBoclipsClient();

    client.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'Ricky',
        lastName: 'Julian',
        email: 'sunnyvale@swearnet.com',
      }),
    );

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <NavbarResponsive />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    fireEvent.click(await screen.findByTestId('side-menu'));

    expect(screen.getByText('Ricky Julian')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('side-menu'));

    expect(screen.queryByText('Ricky Julian')).not.toBeInTheDocument();
  });

  describe('playlist feature', () => {
    const client = new FakeBoclipsClient();

    beforeEach(() => {
      client.users.insertCurrentUser(UserFactory.sample());
    });

    it('does render your library', async () => {
      render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      fireEvent.click(await screen.findByTestId('side-menu'));
      expect(screen.getByText('Your library')).toBeVisible();
    });
  });
});

describe('Desktop - Navbar', () => {
  const client = new FakeBoclipsClient();

  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  describe('playlist feature', () => {
    beforeEach(() => {
      client.users.insertCurrentUser(UserFactory.sample());
    });

    it('does render your library and icon', async () => {
      render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('library-button')).toBeVisible();
        expect(screen.getByText('Your Library')).toBeVisible();
      });
    });
  });
});
