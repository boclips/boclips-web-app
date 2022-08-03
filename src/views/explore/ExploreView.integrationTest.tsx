import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { fireEvent, render } from '@testing-library/react';
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

  it(`shows first subject's books by default and can select other subjects`, async () => {
    const fakeClient = new FakeBoclipsClient();

    fakeClient.openstax.setOpenstaxBooks([
      BookFactory.sample({
        id: 'book-1',
        title: 'Maths book',
        subject: 'Maths',
      }),
      BookFactory.sample({
        id: 'book-2',
        title: 'French book',
        subject: 'French',
      }),
      BookFactory.sample({
        id: 'book-3',
        title: 'Physics-1',
        subject: 'Physics',
      }),
      BookFactory.sample({
        id: 'book-4',
        title: 'Physics-2',
        subject: 'Physics',
      }),
    ]);

    const wrapper = renderExploreView(fakeClient);

    expect(await wrapper.findByText('Maths book')).toBeVisible();
    expect(await wrapper.queryByText('French book')).toBeNull();

    fireEvent.click(wrapper.getByText('French'));

    expect(await wrapper.findByText('French book')).toBeVisible();
  });
});
