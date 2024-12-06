import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import React from 'react';
import Footer from '@components/layout/Footer';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe(`footer`, () => {
  it(`renders the regular terms and conditions link when user is not classroom`, async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          products: [Product.LIBRARY],
        },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <QueryClientProvider client={new QueryClient()}>
          <Footer />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByRole('link', { name: 'Terms & Conditions' }),
    ).toHaveProperty('href', 'https://www.boclips.com/mlsa');
  });
  it(`renders the classroom terms and conditions link when user is classroom`, async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          products: [Product.CLASSROOM],
        },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <QueryClientProvider client={new QueryClient()}>
          <Footer />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByRole('link', { name: 'Terms & Conditions' }),
    ).toHaveProperty('href', 'https://www.boclips.com/mlsa-classroom');
  });

  it(`renders passed terms and conditions link`, async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          products: [Product.LIBRARY],
        },
      }),
    );

    const wrapper = render(
      <BoclipsClientProvider client={apiClient}>
        <QueryClientProvider client={new QueryClient()}>
          <Footer termsAndConditionsLink="https://blah.com/" />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByRole('link', { name: 'Terms & Conditions' }),
    ).toHaveProperty('href', 'https://blah.com/');
  });
});
