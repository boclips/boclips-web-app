import { fireEvent, RenderResult, within } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Book } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { v4 as uuidv4 } from 'uuid';

export const getTableOfContent = (book: Book, wrapper: RenderResult) =>
  wrapper.queryByLabelText(`Table of contents of ${book.title}`);

export const validateVisibleHeadings = (
  element: HTMLElement,
  level: number,
  titles: string[],
) => {
  const headings = within(element).getAllByRole('heading', { level });

  expect(headings).toHaveLength(titles.length);

  for (let i = 0; i < headings.length; i++) {
    expect(headings[i]).toBeVisible();
    expect(headings[i].textContent).toBe(titles[i]);
  }
};

export const setUpClientWithBook = (book: Book) => {
  const client = new FakeBoclipsClient();
  client.openstax.setOpenstaxBooks([book]);
  client.users.setCurrentUserFeatures({ BO_WEB_APP_OPENSTAX: true });
  return client;
};

export const createBook = () => {
  return BookFactory.sample({
    id: uuidv4(),
    title: 'Everything to know about ducks',
    subject: 'Essentials',
    chapters: [
      {
        title: 'Chapter 1: Introduction',
        index: 0,
        sections: [
          {
            title: '1.1 Life at the coop',
            index: 2,
            videos: [
              VideoFactory.sample({
                title: 'Baby ducks playing',
                createdBy: 'Farmer Joe',
              }),
            ],
            videoIds: ['2'],
          },
          {
            title: '1.2 Adventures outside',
            index: 3,
            videos: [],
            videoIds: [],
          },
          {
            title: 'Chapter Overview',
            index: 0,
            videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
            videoIds: ['2'],
          },
          {
            title: 'Discussion Prompt',
            index: 1,
            videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
            videoIds: ['2'],
          },
        ],
      },
      {
        title: 'Chapter 2: Epilogue',
        index: 1,
        sections: [
          {
            title: '2.1 This is the end',
            index: 0,
            videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
            videoIds: ['2'],
          },
        ],
      },
    ],
  });
};

export const chapterTitle = (bookDetails: HTMLElement) => {
  return within(bookDetails).getByRole('heading', {
    level: 2,
  });
};

export const sectionTitle = (bookDetails: HTMLElement) => {
  return within(bookDetails).getByRole('heading', {
    level: 3,
  });
};

export const navigateTo = (wrapper: RenderResult, link: string) => {
  const button = wrapper.getByRole('link', {
    name: new RegExp(link),
  });
  fireEvent.click(button);
};
