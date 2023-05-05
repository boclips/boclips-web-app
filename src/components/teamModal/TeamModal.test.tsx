import { render, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import TeamModal from 'src/components/teamModal/TeamModal';

describe('My Team modal', () => {
  it('renders organisation page', () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <TeamModal closeModal={() => jest.fn()} />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(wrapper.getByText('Add new user')).toBeInTheDocument();
    expect(wrapper.getByText('First name')).toBeInTheDocument();
    expect(wrapper.getByText('Last name')).toBeInTheDocument();
    expect(wrapper.getByText('Email address')).toBeInTheDocument();
  });

  it('creates an account', async () => {
    const client = new FakeBoclipsClient();

    client.users.createUser = jest.fn();

    const wrapper = render(
      <BoclipsClientProvider client={client}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <TeamModal closeModal={() => jest.fn()} />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    await userEvent.type(wrapper.getByPlaceholderText('John'), 'Andrzej');
    await userEvent.type(wrapper.getByPlaceholderText('Smith'), 'Duda');
    await userEvent.type(
      wrapper.getByPlaceholderText('example@email.com'),
      'dudu@wp.pl',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Create' }));

    await waitFor(() => expect(client.users.createUser).toHaveBeenCalled());
  });

  it('validates the input fields', async () => {
    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <TeamModal closeModal={() => jest.fn()} />
          </BoclipsSecurityProvider>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    await userEvent.type(wrapper.getByPlaceholderText('John'), 'A');
    await userEvent.type(wrapper.getByPlaceholderText('Smith'), 'D');
    await userEvent.type(
      wrapper.getByPlaceholderText('example@email.com'),
      'd',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Create' }));

    expect(
      wrapper.getByText(
        'Please enter a valid first name (2 characters or longer)',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'Please enter a valid last name (2 characters or longer)',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText('Please enter a valid email address'),
    ).toBeInTheDocument();
  });
});
