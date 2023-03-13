import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { BookList } from 'src/components/openstax/bookList/BookList';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';
import { getProviderByName } from 'src/views/openstax/provider/AlignmentProviderFactory';

describe('Openstax book list', () => {
  it(`displays all books`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const books = [
      OpenstaxBookFactory.sample({ title: 'Maths' }),
      OpenstaxBookFactory.sample({ title: 'Physics' }),
    ];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <BookList books={books} isLoading={false} />
        </AlignmentContextProvider>
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.getByText('Physics')).toBeInTheDocument();
  });

  it(`books without chapters are hidden`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const books = [
      OpenstaxBookFactory.sample({ provider: 'openstax', title: 'Maths' }),
      OpenstaxBookFactory.sample({
        provider: 'openstax',
        title: 'Physics',
        topics: [],
      }),
    ];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <BookList books={books} isLoading={false} />
        </AlignmentContextProvider>
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
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <BookList books={books} isLoading />
        </AlignmentContextProvider>
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
