import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

describe('ContentView', () => {
  it('loads the no content view (for now)', async () => {
    const apiClient = new FakeBoclipsClient();
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        features: { BO_WEB_APP_DEV: true },
      }),
    );

    const wrapper = render(
      <MemoryRouter initialEntries={['/content']}>
        <App apiClient={apiClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('My content')).toBeVisible();

    expect(
      wrapper.getByText('You have no licensed content... yet!'),
    ).toBeVisible();
    expect(wrapper.getByText('This is just a placeholder')).toBeInTheDocument();
  });
});
