import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { BookList } from 'src/components/openstax/bookList/BookList';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';

describe('Openstax book list', () => {
  it(`displays all books`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const books = [
      OpenstaxBookFactory.sample({ title: 'Maths' }),
      OpenstaxBookFactory.sample({ title: 'Physics' }),
    ];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <BookList books={books} isLoading={false} />
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.getByText('Physics')).toBeInTheDocument();
  });

  it(`books without chapters are hidden`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const books = [
      OpenstaxBookFactory.sample({ title: 'Maths' }),
      OpenstaxBookFactory.sample({ title: 'Physics', chapters: [] }),
    ];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <BookList books={books} isLoading={false} />
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.queryByText('Physics')).toBeNull();
  });

  it(`displays books skeleton`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const books = [
      OpenstaxBookFactory.sample({ title: 'Maths' }),
      OpenstaxBookFactory.sample({ title: 'Physics' }),
    ];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <BookList books={books} isLoading />
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByTestId('book-card-skeleton-1'),
    ).toBeInTheDocument();

    expect(
      await wrapper.findByTestId('book-card-skeleton-2'),
    ).toBeInTheDocument();
  });
});
