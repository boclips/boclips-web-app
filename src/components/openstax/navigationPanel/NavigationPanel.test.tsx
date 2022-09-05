import { render } from 'src/testSupport/render';
import React from 'react';
import { NavigationPanel } from 'src/components/openstax/navigationPanel/NavigationPanel';
import {
  ChapterFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';
import { fireEvent } from '@testing-library/react';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { OpenstaxMobileMenuProvider } from 'src/components/common/providers/OpenstaxMobileMenuProvider';

describe('OpenstaxBookNavigationPanel', () => {
  it('renders book title with chapters, chapter intros and sections', async () => {
    window.resizeTo(1500, 1024);

    const book: OpenstaxBook = OpenstaxBookFactory.sample({
      title: 'should show book title',
      chapters: [
        ChapterFactory.sample({
          number: 1,
          title: 'should show chapter 1',
          sections: [
            SectionFactory.sample({
              number: undefined,
              title: 'Chapter Overview',
              videoIds: ['1'],
            }),
            SectionFactory.sample({
              number: undefined,
              title: 'Discussion Prompt',
              videoIds: ['2'],
            }),
            SectionFactory.sample({
              number: 99,
              title: 'section 99',
              videoIds: ['1', '2'],
            }),
          ],
        }),
      ],
    });

    const wrapper = render(
      <OpenstaxMobileMenuProvider>
        <NavigationPanel book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    const bookTitle = await wrapper.findByRole('heading', { level: 1 });
    expect(bookTitle).toBeVisible();
    expect(bookTitle).toHaveTextContent('should show book title');

    const chapterOne = wrapper.getByRole('heading', { level: 2 });
    expect(chapterOne).toBeVisible();
    expect(chapterOne).toHaveTextContent('Chapter 1: should show chapter 1');

    const chapterOverviewLink = wrapper.getByRole('link', {
      name: 'Chapter Overview',
    });
    expect(chapterOverviewLink).toHaveAttribute(
      'href',
      '/explore/openstax/book_id#chapter-1',
    );

    const discussionPromptLink = wrapper.getByRole('link', {
      name: 'Discussion Prompt',
    });
    expect(discussionPromptLink).toHaveAttribute(
      'href',
      '/explore/openstax/book_id#discussion-prompt-1',
    );

    const sectionNinetyNineLink = wrapper.getByRole('link', {
      name: '1.99 section 99',
    });
    expect(sectionNinetyNineLink).toHaveAttribute(
      'href',
      '/explore/openstax/book_id#section-1-99',
    );

    const videoLabel = wrapper.getByText('4 videos');
    expect(videoLabel).toBeVisible();
  });

  it('does not render close button in desktop view', () => {
    window.resizeTo(1500, 1024);

    const wrapper = render(
      <OpenstaxMobileMenuProvider>
        <NavigationPanel book={OpenstaxBookFactory.sample()} />
      </OpenstaxMobileMenuProvider>,
    );

    expect(
      wrapper.queryByRole('button', { name: 'Close the Table of contents' }),
    ).toBeNull();
  });

  it('renders close button with label in tablet view, which calls callback', () => {
    window.resizeTo(1000, 1024);

    const wrapper = render(
      <OpenstaxMobileMenuProvider triggerOpen>
        <NavigationPanel book={OpenstaxBookFactory.sample()} />
      </OpenstaxMobileMenuProvider>,
    );

    const closeButton = wrapper.getByRole('button', {
      name: 'Close the Table of contents',
    });

    expect(closeButton).toBeVisible();

    fireEvent.click(closeButton);

    expect(wrapper.queryByText('button')).toBeNull();
  });

  it('renders close button without label in tablet view, which calls callback', () => {
    window.resizeTo(320, 1024);

    const wrapper = render(
      <OpenstaxMobileMenuProvider triggerOpen>
        <NavigationPanel book={OpenstaxBookFactory.sample()} />
      </OpenstaxMobileMenuProvider>,
    );

    const closeButton = wrapper.getByLabelText('Close the Table of contents');

    expect(closeButton).toBeVisible();
    expect(wrapper.queryByText('Close')).toBeNull();
    fireEvent.click(closeButton);
    expect(wrapper.queryByText('button')).toBeNull();
  });

  it('chapters can be expanded and collapsed, first chapter expanded by default', () => {
    window.resizeTo(1500, 1024);

    const book: OpenstaxBook = OpenstaxBookFactory.sample({
      chapters: [
        ChapterFactory.sample({
          number: 1,
          title: 'default expanded',
          sections: [
            SectionFactory.sample({
              number: 1,
              title: 'initially visible',
              videoIds: ['1', '2'],
            }),
          ],
        }),
        ChapterFactory.sample({
          number: 2,
          title: 'default collapsed',
          sections: [
            SectionFactory.sample({
              number: 1,
              title: 'initially hidden',
              videoIds: ['1', '2'],
            }),
          ],
        }),
      ],
    });
    const wrapper = render(
      <OpenstaxMobileMenuProvider>
        <NavigationPanel book={book} />
      </OpenstaxMobileMenuProvider>,
    );

    expect(
      wrapper.getByRole('heading', { name: '1.1 initially visible' }),
    ).toBeVisible();
    expect(
      wrapper.queryByRole('heading', { name: '2.1 initially hidden' }),
    ).toBeNull();

    const chapter1Button = wrapper.getByRole('button', {
      name: 'Chapter 1: default expanded',
    });
    chapter1Button.click();
    expect(
      wrapper.queryByRole('heading', { name: '1.1 initially visible' }),
    ).toBeNull();

    const chapter2Button = wrapper.getByRole('button', {
      name: 'Chapter 2: default collapsed',
    });
    chapter2Button.click();
    expect(
      wrapper.getByRole('heading', { name: '2.1 initially hidden' }),
    ).toBeVisible();
  });
});
