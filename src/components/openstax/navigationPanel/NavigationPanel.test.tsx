import { render } from 'src/testSupport/render';
import React from 'react';
import { NavigationPanel } from 'src/components/openstax/navigationPanel/NavigationPanel';
import {
  ChapterFactory,
  SectionFactory,
} from 'boclips-api-client/dist/test-support/BookFactory';
import { fireEvent, waitFor } from '@testing-library/react';
import { OpenstaxBookFactory } from 'src/testSupport/OpenstaxBookFactory';
import { OpenstaxBook } from 'src/types/OpenstaxBook';
import { OpenstaxMobileMenuProvider } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import {
  resizeToDesktop,
  resizeToMobile,
  resizeToTablet,
} from 'src/testSupport/resizeTo';

describe('OpenstaxBookNavigationPanel', () => {
  it('renders book title with logo, chapters, chapter intros and sections', async () => {
    resizeToDesktop();

    const book: OpenstaxBook = OpenstaxBookFactory.sample({
      title: 'should show book title',
      logoUrl: 'test',
      chapters: [
        ChapterFactory.sample({
          index: 0,
          title: 'Chapter 1: should show chapter 1',
          sections: [
            SectionFactory.sample({
              index: 0,
              title: 'Chapter Overview',
              videoIds: ['1'],
            }),
            SectionFactory.sample({
              index: 1,
              title: 'Discussion Prompt',
              videoIds: ['2'],
            }),
            SectionFactory.sample({
              index: 2,
              title: '1.99 section 99',
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

    expect(wrapper.getByAltText('should show book title cover')).toBeVisible();

    const chapterOne = wrapper.getByRole('heading', { level: 2 });
    expect(chapterOne).toBeVisible();
    expect(chapterOne).toHaveTextContent('Chapter 1: should show chapter 1');

    const chapterOverviewLink = wrapper.getByRole('link', {
      name: 'Chapter Overview',
    });
    expect(chapterOverviewLink).toHaveAttribute(
      'href',
      '/explore/openstax/book_id#chapter-0',
    );

    const discussionPromptLink = wrapper.getByRole('link', {
      name: 'Discussion Prompt',
    });
    expect(discussionPromptLink).toHaveAttribute(
      'href',
      '/explore/openstax/book_id#chapter-0-discussion-prompt',
    );

    const sectionNinetyNineLink = wrapper.getByRole('link', {
      name: '1.99 section 99',
    });
    expect(sectionNinetyNineLink).toHaveAttribute(
      'href',
      '/explore/openstax/book_id#chapter-0-section-2',
    );

    const videoLabel = wrapper.getByText('4 videos');
    expect(videoLabel).toBeVisible();
  });

  it('does not render close button in desktop view', () => {
    resizeToDesktop();

    const wrapper = render(
      <OpenstaxMobileMenuProvider>
        <NavigationPanel book={OpenstaxBookFactory.sample()} />
      </OpenstaxMobileMenuProvider>,
    );

    expect(
      wrapper.queryByRole('button', { name: 'Close the Table of contents' }),
    ).toBeNull();
  });

  it.each([
    ['mobile', resizeToMobile],
    ['tablet', resizeToTablet],
  ])(
    'does not render book logo on %s',
    async (_screenType: string, resize: () => void) => {
      resize();
      const wrapper = render(
        <OpenstaxMobileMenuProvider>
          <NavigationPanel
            book={OpenstaxBookFactory.sample({
              title: 'book',
              logoUrl: 'logo',
            })}
          />
        </OpenstaxMobileMenuProvider>,
      );

      expect(wrapper.queryByAltText('book cover')).toBeNull();
    },
  );

  it('renders close button with label in tablet view, which calls callback', () => {
    resizeToTablet();

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
    resizeToTablet();

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

  it('chapters can be expanded and collapsed, first chapter expanded by default', async () => {
    resizeToDesktop();

    const book: OpenstaxBook = OpenstaxBookFactory.sample({
      chapters: [
        ChapterFactory.sample({
          index: 0,
          title: 'Chapter 1: default expanded',
          sections: [
            SectionFactory.sample({
              index: 0,
              title: '1.1 initially visible',
              videoIds: ['1', '2'],
            }),
          ],
        }),
        ChapterFactory.sample({
          index: 1,
          title: 'Chapter 2: default collapsed',
          sections: [
            SectionFactory.sample({
              index: 0,
              title: '2.1 initially hidden',
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

    await waitFor(() =>
      expect(
        wrapper.queryByRole('heading', { name: '1.1 initially visible' }),
      ).toBeNull(),
    );

    const chapter2Button = wrapper.getByRole('button', {
      name: 'Chapter 2: default collapsed',
    });
    chapter2Button.click();

    await waitFor(() =>
      expect(
        wrapper.getByRole('heading', { name: '2.1 initially hidden' }),
      ).toBeVisible(),
    );
  });
});
