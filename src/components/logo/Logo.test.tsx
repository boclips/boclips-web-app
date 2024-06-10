import { render } from 'src/testSupport/render';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import React from 'react';
import Logo from 'src/components/logo/Logo';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('logo', () => {
  it('renders the Library logo if no logo url is provided and user does not have classroom product', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'account-id',
          name: 'Account name',
          products: [Product.LIBRARY],
          type: AccountType.STANDARD,
          logoUrl: null,
        },
      }),
    );

    const navbar = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <Logo />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(
      navbar.getByLabelText('Boclips logo - Go to homepage'),
    ).toBeInTheDocument();

    expect(await navbar.findByTestId('library-logo')).toBeVisible();
  });

  it('renders the Classroom logo if no logo url is provided and user has classroom product', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: 'account-id',
          name: 'Account name',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
          logoUrl: null,
        },
      }),
    );

    const navbar = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <Logo />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(
      navbar.getByLabelText('Boclips logo - Go to homepage'),
    ).toBeInTheDocument();

    expect(await navbar.findByTestId('classroom-logo')).toBeVisible();
  });

  it('does renders the accounts logo if logo url is provided', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          id: '1',
          name: 'Pearson',
          logoUrl: 'this is a logo url',
        },
      }),
    );

    const navbar = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={apiClient}>
          <Logo />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(
      await navbar.findByLabelText('Pearson logo - Go to homepage'),
    ).toBeInTheDocument();
  });
});
