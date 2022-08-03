import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import Navbar from 'src/components/layout/Navbar';
import React from 'react';

describe('explore button', () => {
  let fakeClient: FakeBoclipsClient;

  beforeEach(() => {
    window.resizeTo(1680, 1024);

    fakeClient = new FakeBoclipsClient();
  });

  const renderExploreButton = () =>
    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={fakeClient}>
          <Navbar />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

  it('shows the explore button', async () => {
    const navbar = renderExploreButton();

    expect(await navbar.findByText('Explore')).toBeInTheDocument();
  });
});
