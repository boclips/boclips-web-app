import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { axe } from 'jest-axe';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';

describe(`Explore view`, () => {
  it(`has no violations`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.setCurrentUserFeatures({ BO_WEB_APP_SPARKS: true });
    fakeClient.alignments.setThemesByProvider({
      providerName: 'openstax',
      themes: [
        ThemeFactory.sample({
          id: 'theme-1',
          title: 'Book about Math',
          type: 'Maths',
        }),
        ThemeFactory.sample({
          id: 'theme-2',
          type: 'Maths',
        }),
      ],
    });

    fakeClient.alignments.setProviders([
      ProviderFactory.sample('openstax', {
        types: ['Maths', 'Business', 'Humanities'],
      }),
    ]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/sparks/openstax']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Book about Math')).toBeVisible();

    const results = await axe(wrapper.container);
    expect(results).toHaveNoViolations();
  });
});
