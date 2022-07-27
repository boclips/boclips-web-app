import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient } from 'react-query';
import { BoclipsClient } from 'boclips-api-client';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';

describe(`Explore view`, () => {
  const renderExploreView = (client: BoclipsClient) =>
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <App
          apiClient={client}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );

  it(`displays all subjects that have books`, async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.openstax.setOpenstaxBooks([
      BookFactory.sample({ id: 'book-1', subject: 'Maths' }),
      BookFactory.sample({ id: 'book-2', subject: 'French' }),
      BookFactory.sample({ id: 'book-3', subject: 'Physics' }),
      BookFactory.sample({ id: 'book-4', subject: 'Physics' }),
    ]);

    const wrapper = renderExploreView(fakeClient);

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.getByText('French')).toBeInTheDocument();
    expect(wrapper.getByText('Physics')).toBeInTheDocument();
  });
});
