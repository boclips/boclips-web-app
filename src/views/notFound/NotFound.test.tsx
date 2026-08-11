import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import AppUnauthenticated from 'src/AppUnauthenticated';

describe('NotFoundView', () => {
  it('shows not found if route is unknown', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/randompath']}>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
    expect(
      wrapper.getByRole('button', { name: 'Contact Support' }),
    ).toBeVisible();
  });

  it('not found page has correct page title', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/randompath']}>
        <App
          apiClient={new FakeBoclipsClient()}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
    await waitFor(() => expect(document.title).toEqual('Page not found'));
  });

  it('if unauthenticated use the unauthorized navbar', async () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/register/randompath']}>
        <AppUnauthenticated axiosApiClient={new FakeBoclipsClient()} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Page not found!')).toBeVisible();
    await waitFor(() => expect(document.title).toEqual('Page not found'));
    expect(wrapper.getByTestId('classroom-logo')).toBeVisible();
  });
});
