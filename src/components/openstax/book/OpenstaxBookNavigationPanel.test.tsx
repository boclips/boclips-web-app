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
import { fireEvent } from '@testing-library/react';

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
    const wrapper = render(
      <OpenstaxBookNavigationPanel book={book} onClose={jest.fn} />,
    );

    const bookTitle = wrapper.getByRole('heading', { level: 1 });
    expect(bookTitle).toBeVisible();
    expect(bookTitle).toHaveTextContent('should show book title');

    const chapterOne = wrapper.getByRole('heading', { level: 2 });
    expect(chapterOne).toBeVisible();
    expect(chapterOne).toHaveTextContent('Chapter 1: should show chapter 1');

    const videoLabel = wrapper.getByText('3 videos');
    expect(videoLabel).toBeVisible();
  });

  it('does not render close button in desktop view', () => {
    window.resizeTo(1500, 1024);
    const wrapper = render(
      <OpenstaxBookNavigationPanel
        book={BookFactory.sample()}
        onClose={jest.fn}
      />,
    );

    expect(wrapper.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('renders close button in non-desktop view, which calls callback', () => {
    window.resizeTo(700, 1024);
    const spy = jest.fn();
    const wrapper = render(
      <OpenstaxBookNavigationPanel book={BookFactory.sample()} onClose={spy} />,
    );

    const closeButton = wrapper.getByRole('button', { name: 'Close' });

    expect(closeButton).toBeVisible();

    fireEvent.click(closeButton);

    expect(spy).toHaveBeenCalled();
  });
});
