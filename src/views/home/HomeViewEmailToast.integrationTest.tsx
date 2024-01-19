import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { createReactQueryClient } from 'src/testSupport/createReactQueryClient';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';

describe('home view notifications', () => {
  it('email verified toast not displayed if related request param is missing', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.queryByText('Email successfully verified')).toBeNull();
  });

  it('email verified toast not displayed if related request param is false', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/?email_verified=false']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.queryByText('Email successfully verified')).toBeNull();
  });

  it('display email verified toast if related request param is true and is removed after toast is rendered', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/?email_verified=true']}>
        <App
          reactQueryClient={createReactQueryClient()}
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(wrapper.getByText('Email successfully verified')).toBeVisible(),
    );
  });
});
