import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';

describe('My Team view', () => {
  it('renders my team page', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(wrapper.getByText('My team')).toBeInTheDocument();
    expect(
      wrapper.getByRole('button', { name: 'Add new user' }),
    ).toBeInTheDocument();
  });

  it('creates an account', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/team']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Add new user' }),
    );

    await waitFor(() =>
      wrapper.getByRole('heading', { level: 1, name: 'Add new user' }),
    );

    await userEvent.type(wrapper.getByPlaceholderText('John'), 'Andrzej');
    await userEvent.type(wrapper.getByPlaceholderText('Smith'), 'Duda');
    await userEvent.type(
      wrapper.getByPlaceholderText('example@email.com'),
      'dudu@wp.pl',
    );

    await userEvent.click(wrapper.getByRole('button', { name: 'Create' }));

    await waitFor(() =>
      expect(
        wrapper.getByText('User created successfully'),
      ).toBeInTheDocument(),
    );
  });
});
