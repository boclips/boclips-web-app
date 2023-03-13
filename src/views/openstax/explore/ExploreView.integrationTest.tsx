import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import userEvent from '@testing-library/user-event';

describe(`Explore view`, () => {
  it(`shows 'All' subject as a first one and can select other subjects`, async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });

    fakeClient.alignments.setTypesForProvider('openstax', [
      'Maths',
      'French',
      'Physics',
    ]);
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
    expect(await wrapper.findByText('French book')).toBeVisible();
    expect(await wrapper.findByText('Physics-1')).toBeVisible();
    expect(await wrapper.findByText('Physics-2')).toBeVisible();

    fireEvent.click(wrapper.getByLabelText('subject Maths'));

    expect(await wrapper.findByText('Maths book')).toBeVisible();
    expect(await wrapper.queryByText('French book')).toBeNull();
    expect(await wrapper.queryByText('Physics-1')).toBeNull();
    expect(await wrapper.queryByText('Physics-2')).toBeNull();

    fireEvent.click(wrapper.getByLabelText('subject French'));

    expect(await wrapper.queryByText('Maths book')).toBeNull();
    expect(await wrapper.findByText('French book')).toBeVisible();
    expect(await wrapper.queryByText('Physics-1')).toBeNull();
    expect(await wrapper.queryByText('Physics-2')).toBeNull();
  });

  it('shows Page not found when used non existing provider', async () => {
    const fakeClient = new FakeBoclipsClient();
    fakeClient.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });
    const wrapper = render(
      <MemoryRouter initialEntries={['/explore/wrong-provider']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient()}
        />
      </MemoryRouter>,
    );
    expect(await wrapper.findByText('Page not found!')).toBeVisible();
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

    fakeClient.alignments.setTypesForProvider('openstax', [
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

    expect(await wrapper.findByText('Our OpenStax collection')).toBeVisible();

    await waitFor(() =>
      expect(wrapper.getByLabelText('subject Maths')).toBeVisible(),
    );

    expect(wrapper.getByLabelText('subject All')).toBeVisible();
    expect(wrapper.getByLabelText('subject Business')).toBeVisible();
    expect(wrapper.getByLabelText('subject Humanities')).toBeVisible();
    expect(wrapper.queryByLabelText('subject French')).toBeNull();
  });

  describe('Subject menu focus', () => {
    it('changes the focus when subject is selected', async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });
      fakeClient.openstax.setOpenstaxBooks([
        BookFactory.sample({
          id: 'book-1',
          subject: 'Maths',
          title: 'Algebra',
        }),
        BookFactory.sample({
          id: 'book-2',
          subject: 'French',
        }),
      ]);

      fakeClient.alignments.setTypesForProvider('openstax', [
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

      await waitFor(() => wrapper.getAllByText('Maths'));

      await userEvent.click(wrapper.getByText('All'));

      await userEvent.tab();

      await userEvent.keyboard('{enter}');

      await waitFor(() => wrapper.getAllByText('Algebra'));

      await waitFor(() => {
        expect(wrapper.getByLabelText('book Algebra')).toHaveFocus();
      });
    });
  });
});
