import React from 'react';
import { render } from 'src/testSupport/render';
import LicenseRestrictionsInfo from 'src/components/common/licenseRestrictionsInfo/LicenseRestrictionsInfo';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';

describe('video license restrictions', () => {
  it(`displays license restrictions info without CTA`, async () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <LicenseRestrictionsInfo />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByText(
        'Videos have restrictions associated with their license.',
      ),
    ).toBeVisible();
  });

  it(`displays license restrictions info with CTA`, async () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <LicenseRestrictionsInfo displayCTAText />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByText(
        /Videos have restrictions associated with their license./,
      ),
    ).toBeVisible();
    expect(
      await wrapper.findByText(
        /Click on the video title you want to review before proceeding with billing./,
      ),
    ).toBeVisible();
  });

  it(`does not display license restrictions info when BO_WEB_APP_HIDE_LICENSE_RESTRICTIONS toggle is on`, async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        features: { BO_WEB_APP_HIDE_LICENSE_RESTRICTIONS: true },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <LicenseRestrictionsInfo displayCTAText={false} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(
      wrapper.queryByText(
        'Videos have restrictions associated with their license.',
      ),
    ).not.toBeInTheDocument();
  });
});
