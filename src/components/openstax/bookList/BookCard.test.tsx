import {
  ChapterFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { BookCard } from 'src/components/openstax/bookList/BookCard';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { getProviderByName } from 'src/views/openstax/provider/AlignmentProviderFactory';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';

describe('BookCard', () => {
  it('shows book title and number of videos', () => {
    const book = OpenstaxBookFactory.sample({
      title: 'Olive trees',
      logoUrl: 'svg.com',
      chapters: [
        ChapterFactory.sample({
          sections: [
            SectionFactory.sample({
              videoIds: ['1', '2'],
            }),
          ],
        }),
      ],
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <BookCard book={book} />
        </AlignmentContextProvider>
      </Router>,
    );
    const card = wrapper.getByRole('button', { name: 'book Olive trees' });
    expect(card).toHaveTextContent('Olive trees');
    expect(card).toHaveTextContent('2 videos');
    expect(wrapper.getByAltText('Olive trees cover')).toBeInTheDocument();
  });

  it('shows book cover when logo url is present', () => {
    const book = OpenstaxBookFactory.sample({
      title: 'Olive trees',
      logoUrl: 'svg.com',
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <BookCard book={book} />
        </AlignmentContextProvider>
      </Router>,
    );
    expect(wrapper.getByAltText('Olive trees cover')).toBeInTheDocument();
  });

  it('shows generic book cover when logo url is not present', () => {
    const book = OpenstaxBookFactory.sample({
      title: 'Olive trees',
      logoUrl: '',
    });

    const history = createBrowserHistory();

    const wrapper = render(
      <Router location={history.location} navigator={history}>
        <AlignmentContextProvider provider={getProviderByName('openstax')}>
          <BookCard book={book} />
        </AlignmentContextProvider>
      </Router>,
    );
    expect(
      wrapper.getByAltText('Olive trees generic cover'),
    ).toBeInTheDocument();
  });

  describe('a11y', () => {
    it('focuses main when esc is pressed', async () => {
      const book = OpenstaxBookFactory.sample({
        title: 'Olive trees',
        logoUrl: 'svg.com',
        chapters: [
          ChapterFactory.sample({
            sections: [
              SectionFactory.sample({
                videoIds: ['1', '2'],
              }),
            ],
          }),
        ],
      });

      const history = createBrowserHistory();

      const wrapper = render(
        <Router location={history.location} navigator={history}>
          <main tabIndex={-1}>this is main</main>
          <AlignmentContextProvider provider={getProviderByName('openstax')}>
            <BookCard book={book} />
          </AlignmentContextProvider>
        </Router>,
      );

      await userEvent.tab();

      expect(wrapper.getByLabelText(`book ${book.title}`)).toHaveFocus();

      fireEvent.keyDown(wrapper.getByLabelText(`book ${book.title}`), {
        key: 'Escape',
      });

      expect(wrapper.getByRole('main')).toHaveFocus();
    });
  });
});
