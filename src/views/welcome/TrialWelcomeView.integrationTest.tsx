import { render } from '@testing-library/react';
import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';

describe('TrialWelcome', () => {
  it('displays trial welcome view', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.insertCurrentUser(UserFactory.sample());
    fakeClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });

    const wrapper = render(
      <MemoryRouter initialEntries={['/welcome']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient(queryClientConfig)}
        />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText(
        "You've just been added to Boclips by your colleague",
      ),
    ).toBeVisible();
  });
});
