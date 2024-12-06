import { render } from '@testing-library/react';
import React from 'react';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import InvitedUserInfo from '@components/welcome/InvitedUserInfo';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('Invited User Info', () => {
  it('renders the user info', async () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'David',
        lastName: 'Beckham',
        email: 'db@gmail.com',
        account: {
          ...UserFactory.sample().account,
          name: 'Footballers',
          id: 'id',
          type: AccountType.STANDARD,
        },
      }),
    );

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={client}>
          <InvitedUserInfo />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('Name:')).toBeVisible();
    expect(await wrapper.findByText('David Beckham')).toBeVisible();

    expect(await wrapper.findByText('Organization:')).toBeVisible();
    expect(await wrapper.findByText('Footballers')).toBeVisible();

    expect(await wrapper.findByText('Email:')).toBeVisible();
    expect(await wrapper.findByText('db@gmail.com')).toBeVisible();
  });

  it('renders school if user has Classroom product', async () => {
    const client = new FakeBoclipsClient();
    client.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'David',
        lastName: 'Beckham',
        email: 'db@gmail.com',
        account: {
          ...UserFactory.sample().account,
          name: 'Footballers',
          id: 'id',
          products: [Product.CLASSROOM],
          type: AccountType.STANDARD,
        },
      }),
    );

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={client}>
          <InvitedUserInfo />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(await wrapper.findByText('School:')).toBeVisible();
    expect(wrapper.queryByText('Organization:')).toBeNull();
  });
});
