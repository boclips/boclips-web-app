import {
  fireEvent,
  render,
  RenderResult,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';

describe('OpenstaxBookView', () => {
  it('renders basic book details', async () => {
    window.resizeTo(1500, 1024);
    const client = new FakeBoclipsClient();

    const book: Book = BookFactory.sample({
      id: 'ducklings',
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Introduction',
          number: 1,
          videos: [VideoFactory.sample({ title: 'Chapter video' })],
          videoIds: ['1'],
          sections: [
            {
              title: 'Life at the coop',
              number: 1,
              videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
              videoIds: ['2'],
            },
            {
              title: 'Adventures outside',
              number: 2,
              videos: [],
              videoIds: [],
            },
          ],
        },
      ],
    });

    client.openstax.setOpenstaxBooks([book]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/explore/openstax/ducklings']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    const titles = await wrapper.findAllByRole('heading', {
      level: 1,
      name: 'Everything to know about ducks',
    });

    expect(titles).toHaveLength(2);
    expect(titles[0]).toBeVisible();
    expect(titles[1]).toBeVisible();

    const bookDetails = wrapper.getByLabelText(
      'Content for Everything to know about ducks',
    );

    expect(bookDetails).toBeVisible();
    validateVisibleHeadings(bookDetails, 2, ['Chapter 1: Introduction']);
    validateVisibleHeadings(bookDetails, 3, [
      'Chapter overview',
      '1.1 Life at the coop',
      '1.2 Adventures outside',
    ]);

    const bookToc = wrapper.getByLabelText(
      'Table of contents of Everything to know about ducks',
    );
    expect(bookToc).toBeVisible();
    validateVisibleHeadings(bookToc, 2, ['Chapter 1: Introduction']);
    validateVisibleHeadings(bookToc, 3, [
      'Chapter overview',
      '1.1 Life at the coop',
      '1.2 Adventures outside',
    ]);

    expect(
      wrapper.getByText(
        "We don't have any videos for this section yet. We're working on it!",
      ),
    ).toBeVisible();
  });

  const validateVisibleHeadings = (
    element: HTMLElement,
    level: number,
    titles: string[],
  ) => {
    const headings = within(element).getAllByRole('heading', { level });

    expect(headings).toHaveLength(titles.length);

    for (let i = 0; i < headings.length; i++) {
      expect(headings[i]).toBeVisible();
      expect(headings[i]).toHaveTextContent(titles[i]);
    }
  };

  it('renders section video cards with only thumbnail', async () => {
    const client = new FakeBoclipsClient();
    const videoTitle = 'Baby ducks playing';
    const book: Book = BookFactory.sample({
      id: 'ducklings',
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Introduction',
          number: 1,
          videos: [],
          videoIds: [],
          sections: [
            {
              title: 'Life at the coop',
              number: 1,
              videos: [
                VideoFactory.sample({
                  title: videoTitle,
                  createdBy: 'Farmer Joe',
                }),
              ],
              videoIds: ['2'],
            },
          ],
        },
      ],
    });

    client.openstax.setOpenstaxBooks([book]);

    const wrapper = render(
      <MemoryRouter initialEntries={['/explore/openstax/ducklings']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(
      await wrapper.findByLabelText(`${videoTitle} grid card`),
    ).toBeVisible();

    const playableThumbnail = wrapper.getByRole('button', {
      name: `play ${videoTitle}`,
    });
    expect(playableThumbnail).toBeVisible();

    expect(wrapper.getByText('Farmer Joe')).toBeVisible();
  });

  describe('mobile/tablet view', () => {
    beforeEach(() => {
      window.resizeTo(750, 1024);
    });

    it('will show the navigation view when clicking course content button', async () => {
      const book: Book = BookFactory.sample({
        id: 'ducklings',
        title: 'All about ducks',
      });

      const wrapper = renderBookView(book);

      const courseContentButton = await wrapper.findByRole('button', {
        name: 'Course content',
      });

      expect(getTableOfContent(book, wrapper)).toBeNull();

      fireEvent.click(courseContentButton);

      expect(getTableOfContent(book, wrapper)).toBeVisible();
    });

    it('will close the navigation view, if close is clicked', async () => {
      const book: Book = BookFactory.sample({
        id: 'ducklings',
        title: 'All about ducks',
      });

      const wrapper = renderBookView(book);

      const courseContentButton = await wrapper.findByRole('button', {
        name: 'Course content',
      });

      fireEvent.click(courseContentButton);

      const closeTableOfContent = wrapper.getByRole('button', {
        name: 'Close the Table of contents',
      });

      fireEvent.click(closeTableOfContent);
      expect(getTableOfContent(book, wrapper)).toBeNull();
    });

    const renderBookView = (book: Book): RenderResult => {
      const client = new FakeBoclipsClient();
      client.openstax.setOpenstaxBooks([book]);
      return render(
        <MemoryRouter initialEntries={['/explore/openstax/ducklings']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );
    };

    const getTableOfContent = (book: Book, wrapper: RenderResult) =>
      wrapper.queryByLabelText(`Table of contents of ${book.title}`);
  });
});
