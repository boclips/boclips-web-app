import { render } from 'src/testSupport/render';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import React from 'react';
import Logo from 'src/components/logo/Logo';

describe('logo', () => {
  it('does renders the boclips logo if no logo url is provided', () => {
    const navbar = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <Logo />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(navbar.getByLabelText('Boclips logo')).toBeInTheDocument();
  });

  it('does renders the organisation logo if logo url is provided', async () => {
    const apiClient = new FakeBoclipsClient();

    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        organisation: {
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

    expect(await navbar.findByLabelText('Pearson logo')).toBeInTheDocument();
  });
});
