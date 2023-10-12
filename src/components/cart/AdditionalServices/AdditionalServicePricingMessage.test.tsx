import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from '@testing-library/react';
import React from 'react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { AdditionalServicesPricingMessage } from 'src/components/cart/AdditionalServices/AdditionalServicesPricingMessage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe(`AdditionalServicePricingMessage`, () => {
  it(`should render old copy when user does not have dev flag`, async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: false });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <AdditionalServicesPricingMessage captionsOrTranscriptsRequested />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(
      await wrapper.findByTestId('additional-services-summary'),
    ).toHaveTextContent(
      'Please contact your Account Manager or support@boclips.com for details on potential fees for additional services.',
    );
  });

  it(`should render new copy when user does not have dev flag`, async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={apiClient}>
          <AdditionalServicesPricingMessage captionsOrTranscriptsRequested />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(
      await wrapper.findByTestId('additional-services-summary'),
    ).toHaveTextContent(
      'Information regarding your additional services requestPlease note that requests for human-generated captions can take between 1-3 business days to be provided.For queries surrounding additional services please contact your Account Manager or contact us on support@boclips.com',
    );
  });
});
