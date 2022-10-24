import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from 'src/testSupport/render';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import NavbarResponsive from 'src/components/layout/Navbar';
import { fireEvent, waitFor } from '@testing-library/react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  resizeToDesktop,
  resizeToMobile,
  resizeToTablet,
} from 'src/testSupport/resizeTo';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';

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

      expect(await wrapper.findByTestId('skip_to_content')).toBeInTheDocument();
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

      fireEvent.click(await wrapper.findByLabelText('Menu'));

      expect(wrapper.getByText('Ricky Julian')).toBeInTheDocument();
      expect(wrapper.getByText('sunnyvale@swearnet.com')).toBeInTheDocument();
      expect(wrapper.getByText('Your orders')).toBeInTheDocument();
      expect(wrapper.getByText('Cart')).toBeInTheDocument();
      expect(wrapper.getByText('Platform guide')).toBeInTheDocument();
      expect(wrapper.getByText('Log out')).toBeInTheDocument();
    },
  );

  it.each([
    ['mobile', resizeToMobile],
    ['tablet', resizeToTablet],
  ])(
    'closes menu on click on %s',
    async (_screenType: string, resize: () => void) => {
      resize();

      fireEvent.click(await wrapper.findByLabelText('Menu'));

      expect(wrapper.getByText('Ricky Julian')).toBeInTheDocument();

      fireEvent.click(await wrapper.findByLabelText('Menu'));

      expect(wrapper.queryByText('Ricky Julian')).not.toBeInTheDocument();
    },
  );

  it('is not visible on desktop', async () => {
    resizeToDesktop();

    await waitFor(() =>
      expect(wrapper.queryByLabelText('Menu')).not.toBeInTheDocument(),
    );
  });
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

    expect(
      await wrapper.getByPlaceholderText('Search for videos'),
    ).toBeVisible();
  });
});

describe('Your library in Navbar', () => {
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
        name: 'Your Library find your playlists here',
      }),
    ).toBeVisible();
  });

  it.each([
    ['mobile', resizeToMobile],
    ['tablet', resizeToTablet],
  ])('is visible on %s', async (_screenType: string, resize: () => void) => {
    resize();

    fireEvent.click(await wrapper.findByLabelText('Menu'));
    expect(wrapper.getByText('Your library')).toBeVisible();
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
        await wrapper.findByRole('button', { name: 'Explore openstax books' }),
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
        await wrapper.queryByRole('button', { name: 'Explore openstax books' }),
      ).toBeNull();
    });

    it.each([
      ['mobile', resizeToMobile],
      ['tablet', resizeToTablet],
    ])(
      'will not show the Explore menu option on %s',
      async (_screenType: string, resize: () => void) => {
        resize();

        fireEvent.click(await wrapper.findByLabelText('Menu'));

        expect(wrapper.queryByText('Explore openstax books')).toBeNull();
      },
    );
  });
});
