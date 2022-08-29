import {
  ChapterFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { BookCard } from 'src/components/openstax/bookList/BookCard';
import { render } from '@testing-library/react';
import React from 'react';

describe('BookCard', () => {
  it('shows book title and number of videos', () => {
    const book = OpenstaxBookFactory.sample({
      title: 'Olive trees',
      logoUrl: 'svg.com',
      chapters: [
        ChapterFactory.sample({
          sections: [
            SectionFactory.sample({
              videoIds: ['1'],
            }),
          ],
          videoIds: ['2'],
        }),
        ChapterFactory.sample({
          videoIds: ['3'],
        }),
      ],
    });

    const wrapper = render(<BookCard book={book} />);
    const card = wrapper.getByRole('button', { name: 'book Olive trees' });
    expect(card).toHaveTextContent('Olive trees');
    expect(card).toHaveTextContent('3 videos');
    expect(wrapper.getByAltText('Olive trees cover')).toBeInTheDocument();
  });

  it('shows book title and number of videos', () => {
    const book = OpenstaxBookFactory.sample({
      title: 'Olive trees',
      logoUrl: 'svg.com',
      chapters: [
        ChapterFactory.sample({
          sections: [
            SectionFactory.sample({
              videoIds: ['1'],
            }),
          ],
          videoIds: ['2'],
        }),
        ChapterFactory.sample({
          videoIds: ['3'],
        }),
      ],
    });

    const wrapper = render(<BookCard book={book} />);
    const card = wrapper.getByRole('button', { name: 'book Olive trees' });
    expect(card).toHaveTextContent('Olive trees');
    expect(card).toHaveTextContent('3 videos');
  });

  it('shows book cover when logo url is present', () => {
    const book = OpenstaxBookFactory.sample({
      title: 'Olive trees',
      logoUrl: 'svg.com',
      chapters: [
        ChapterFactory.sample({
          sections: [
            SectionFactory.sample({
              videoIds: ['1'],
            }),
          ],
          videoIds: ['2'],
        }),
        ChapterFactory.sample({
          videoIds: ['3'],
        }),
      ],
    });

    const wrapper = render(<BookCard book={book} />);
    expect(wrapper.getByAltText('Olive trees cover')).toBeInTheDocument();
  });

  it('shows generic book cover when logo url is not present', () => {
    const book = OpenstaxBookFactory.sample({
      title: 'Olive trees',
      logoUrl: '',
      chapters: [
        ChapterFactory.sample({
          sections: [
            SectionFactory.sample({
              videoIds: ['1'],
            }),
          ],
          videoIds: ['2'],
        }),
        ChapterFactory.sample({
          videoIds: ['3'],
        }),
      ],
    });

    const wrapper = render(<BookCard book={book} />);
    expect(
      wrapper.getByAltText('Olive trees generic cover'),
    ).toBeInTheDocument();
  });
});
