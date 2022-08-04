import { render } from 'src/testSupport/render';
import React from 'react';
import { OpenstaxBookNavigationPanel } from 'src/components/openstax/book/OpenstaxBookNavigationPanel';
import {
  BookFactory,
  ChapterFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';
import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';

describe('OpenstaxBookNavigationPanel', () => {
  it('renders book title with chapters and sections', () => {
    const book: Book = BookFactory.sample({
      title: 'should show book title',
      chapters: [
        ChapterFactory.sample({
          number: 1,
          title: 'should show chapter 1',
          videos: [VideoFactory.sample({})],
          sections: [
            SectionFactory.sample({
              videos: [VideoFactory.sample({}), VideoFactory.sample({})],
            }),
          ],
        }),
      ],
    });
    const wrapper = render(<OpenstaxBookNavigationPanel book={book} />);

    const bookTitle = wrapper.getByRole('heading', { level: 1 });
    expect(bookTitle).toBeVisible();
    expect(bookTitle).toHaveTextContent('should show book title');

    const chapterOne = wrapper.getByRole('heading', { level: 2 });
    expect(chapterOne).toBeVisible();
    expect(chapterOne).toHaveTextContent('Chapter 1: should show chapter 1');

    const videoLabel = wrapper.getByText('3 videos');
    expect(videoLabel).toBeVisible();
  });
});
