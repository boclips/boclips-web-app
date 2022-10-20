import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';

describe(`Explore view`, () => {
  it(`shows first subject's books by default and can select other subjects`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });

    fakeClient.openstax.setOpenstaxSubjects(['Maths', 'French', 'Physics']);
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

    const wrapper = render(
      <MemoryRouter initialEntries={['/explore/openstax']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );

    expect(await wrapper.findByText('Maths book')).toBeVisible();
    expect(await wrapper.queryByText('French book')).toBeNull();

    fireEvent.click(wrapper.getByText('French'));

    expect(await wrapper.findByText('French book')).toBeVisible();
  });

  it(`only show subjects that are supported`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });
    fakeClient.openstax.setOpenstaxBooks([
      BookFactory.sample({
        id: 'book-1',
        subject: 'Maths',
      }),
      BookFactory.sample({
        id: 'book-2',
        subject: 'French',
      }),
    ]);

    fakeClient.openstax.setOpenstaxSubjects([
      'Maths',
      'Business',
      'Humanities',
    ]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/explore/openstax']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByText('Our best content aligned to OpenStax courses'),
    ).toBeVisible();

    expect(wrapper.getByLabelText('subject Maths')).toBeVisible();
    expect(wrapper.getByLabelText('subject Business')).toBeVisible();
    expect(wrapper.getByLabelText('subject Humanities')).toBeVisible();
    expect(wrapper.queryByLabelText('subject French')).toBeNull();
  });
});
