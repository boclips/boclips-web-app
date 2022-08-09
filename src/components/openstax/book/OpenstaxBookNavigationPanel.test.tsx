import { render } from 'src/testSupport/render';
import React from 'react';
import { OpenstaxBookNavigationPanel } from 'src/components/openstax/book/OpenstaxBookNavigationPanel';
import {
  ChapterFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';
import { fireEvent } from '@testing-library/react';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { OpenstaxBook } from 'src/types/OpenstaxBook';

describe('OpenstaxBookNavigationPanel', () => {
  it('renders book title with chapters and sections', () => {
    const book: OpenstaxBook = OpenstaxBookFactory.sample({
      title: 'should show book title',
      chapters: [
        ChapterFactory.sample({
          number: 1,
          title: 'should show chapter 1',
          videoIds: ['1'],
          sections: [
            SectionFactory.sample({
              videoIds: ['1', '2'],
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
        book={OpenstaxBookFactory.sample()}
        onClose={jest.fn}
      />,
    );

    expect(
      wrapper.queryByRole('button', { name: 'Close the Table of contents' }),
    ).toBeNull();
  });

  it('renders close button with label in tablet view, which calls callback', () => {
    window.resizeTo(1000, 1024);
    const spy = jest.fn();
    const wrapper = render(
      <OpenstaxBookNavigationPanel
        book={OpenstaxBookFactory.sample()}
        onClose={spy}
      />,
    );

    const closeButton = wrapper.getByRole('button', {
      name: 'Close the Table of contents',
    });

    expect(closeButton).toBeVisible();

    fireEvent.click(closeButton);

    expect(spy).toHaveBeenCalled();
  });

  it('renders close button without label in tablet view, which calls callback', () => {
    window.resizeTo(320, 1024);
    const spy = jest.fn();
    const wrapper = render(
      <OpenstaxBookNavigationPanel
        book={OpenstaxBookFactory.sample()}
        onClose={spy}
      />,
    );

    const closeButton = wrapper.getByLabelText('Close the Table of contents');

    expect(closeButton).toBeVisible();
    expect(wrapper.queryByText('Close')).toBeNull();
    fireEvent.click(closeButton);

    expect(spy).toHaveBeenCalled();
  });
});
