import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from 'src/testSupport/render';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import NavbarResponsive from 'src/components/layout/Navbar';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  resizeToDesktop,
  resizeToMobile,
  resizeToTablet,
} from 'src/testSupport/resizeTo';
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

    fireEvent.click(await screen.findByLabelText('Menu'));

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

    fireEvent.click(await screen.findByLabelText('Menu'));

    expect(screen.getByText('Ricky Julian')).toBeInTheDocument();

    fireEvent.click(await screen.findByLabelText('Menu'));

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

      fireEvent.click(await screen.findByLabelText('Menu'));
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

describe('Explore Openstax in Navbar', () => {
  describe('When user has BO_WEB_APP_OPENSTAX feature flag', () => {
    const client = new FakeBoclipsClient();
    let wrapper;

    beforeEach(() => {
      client.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });

      wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    });

    it(`will show the Explore menu option on desktop`, async () => {
      resizeToDesktop();

      expect(
        await wrapper.findByRole('button', { name: 'Explore' }),
      ).toBeVisible();
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])(
      'will show the Explore menu option on %s',
      async (_screenType: string, resize: () => void) => {
        resize();

        fireEvent.click(await wrapper.findByLabelText('Menu'));

        expect(wrapper.getByText('Explore')).toBeVisible();
      },
    );
  });

  describe('When user does not have BO_WEB_APP_OPENSTAX', () => {
    const client = new FakeBoclipsClient();
    let wrapper;

    beforeEach(() => {
      client.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: false });

      wrapper = render(
        <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
          <BoclipsClientProvider client={client}>
            <NavbarResponsive />
          </BoclipsClientProvider>
        </BoclipsSecurityProvider>,
      );
    });

    it(`will not show the Explore menu option on desktop`, async () => {
      resizeToDesktop();

      expect(
        await wrapper.queryByRole('button', { name: 'Explore' }),
      ).toBeNull();
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])(
      'will not show the Explore menu option on %s',
      async (_screenType: string, resize: () => void) => {
        resize();

        fireEvent.click(await screen.findByLabelText('Menu'));

        expect(screen.queryByText('Explore')).toBeNull();
      },
    );
  });
});
