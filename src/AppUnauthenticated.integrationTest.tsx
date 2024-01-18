import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import AppUnauthenticated from 'src/AppUnauthenticated';

describe('Unauthenticated app', () => {
  it('renders registration view without authentication', async () => {
    const apiClient = new FakeBoclipsClient();

    const wrapper = render(
      <MemoryRouter initialEntries={['/register']}>
        <AppUnauthenticated axiosApiClient={apiClient} />,
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Create your free account')).toBeVisible();
  });
});
