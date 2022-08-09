import {
  ChapterFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BookCard } from 'src/components/book/BookCard';
import { render } from '@testing-library/react';
import React from 'react';

describe('BookCard', () => {
  it('shows book title and number of videos', () => {
    const book = OpenstaxBookFactory.sample({
      title: 'Olive trees',
      chapters: [
        ChapterFactory.sample({
          sections: [
            SectionFactory.sample({
              videos: [VideoFactory.sample({})],
            }),
          ],
          videos: [VideoFactory.sample({})],
        }),
        ChapterFactory.sample({
          videos: [VideoFactory.sample({})],
        }),
      ],
    });

    const wrapper = render(<BookCard book={book} />);
    const card = wrapper.getByRole('button', { name: 'book Olive trees' });
    expect(card).toHaveTextContent('Olive trees');
    expect(card).toHaveTextContent('3 videos');
  });
});
