import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { resizeToDesktop } from 'src/testSupport/resizeTo';
import {
  setUpClientWithBook,
  validateVisibleHeadings,
} from 'src/views/openstax/book/OpenstaxBookViewTestSupport';

describe('Openstax book view pagination buttons', () => {
  it('renders next and previous chapters when clicking pagination buttons', async () => {
    resizeToDesktop();
    const book = createBook();

    const client = setUpClientWithBook(book);

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

    const nextChapterButton = wrapper.getByRole('link', {
      name: 'Next Chapter',
    });
    fireEvent.click(nextChapterButton);

    const bookDetailsNextChapter = wrapper.getByLabelText(
      'Content for Everything to know about ducks',
    );

    expect(bookDetailsNextChapter).toBeVisible();
    validateVisibleHeadings(bookDetailsNextChapter, 2, ['Chapter 2: Epilogue']);
    validateVisibleHeadings(bookDetailsNextChapter, 3, [
      '2.1 This is the end (1 video)',
    ]);

    const previousChapterButton = wrapper.getByRole('link', {
      name: 'Previous Chapter',
    });
    fireEvent.click(previousChapterButton);

    const bookDetailsPreviousChapter = wrapper.getByLabelText(
      'Content for Everything to know about ducks',
    );
    validateVisibleHeadings(bookDetailsPreviousChapter, 2, [
      'Chapter 1: Introduction',
    ]);
    validateVisibleHeadings(bookDetailsPreviousChapter, 3, [
      'Chapter Overview (1 video)',
      'Discussion Prompt (1 video)',
      '1.1 Life at the coop (1 video)',
      '1.2 Adventures outside (0 videos)',
    ]);
  });

  it('renders next and previous chapters even if chapters numeration is not continuous', async () => {
    resizeToDesktop();
    const book = BookFactory.sample({
      id: 'ducklings',
      title: 'Everything to know about ducks',
      subject: 'Essentials',
      chapters: [
        {
          title: 'Introduction',
          number: 1,
          sections: [
            {
              title: 'Life at the coop',
              number: 1,
              videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
              videoIds: ['2'],
            },
          ],
        },
        {
          title: 'Epilogue',
          number: 99,
          sections: [
            {
              title: 'This is the end',
              number: 1,
              videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
              videoIds: ['2'],
            },
          ],
        },
      ],
    });

    const client = setUpClientWithBook(book);

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

    const nextChapterButton = wrapper.getByRole('link', {
      name: 'Next Chapter',
    });
    fireEvent.click(nextChapterButton);

    const bookDetailsNextChapter = wrapper.getByLabelText(
      'Content for Everything to know about ducks',
    );

    expect(bookDetailsNextChapter).toBeVisible();
    validateVisibleHeadings(bookDetailsNextChapter, 2, [
      'Chapter 99: Epilogue',
    ]);
    validateVisibleHeadings(bookDetailsNextChapter, 3, [
      '99.1 This is the end (1 video)',
    ]);

    const previousChapterButton = wrapper.getByRole('link', {
      name: 'Previous Chapter',
    });
    fireEvent.click(previousChapterButton);

    const bookDetailsPreviousChapter = wrapper.getByLabelText(
      'Content for Everything to know about ducks',
    );
    validateVisibleHeadings(bookDetailsPreviousChapter, 2, [
      'Chapter 1: Introduction',
    ]);
    validateVisibleHeadings(bookDetailsPreviousChapter, 3, [
      '1.1 Life at the coop (1 video)',
    ]);
  });

  it('navigation panel has opened chapter 2 accordion when clicked next chapter button', async () => {
    resizeToDesktop();
    const book = createBook();

    const client = setUpClientWithBook(book);

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

    const nextChapterButton = wrapper.getByRole('link', {
      name: 'Next Chapter',
    });
    fireEvent.click(nextChapterButton);

    const bookToc = wrapper.getByLabelText(
      'Table of contents of Everything to know about ducks',
    );
    expect(bookToc).toBeVisible();
    validateVisibleHeadings(bookToc, 2, [
      'Chapter 1: Introduction',
      'Chapter 2: Epilogue',
    ]);
    validateVisibleHeadings(bookToc, 3, ['2.1 This is the end']);
  });
});

const createBook = () => {
  return BookFactory.sample({
    id: 'ducklings',
    title: 'Everything to know about ducks',
    subject: 'Essentials',
    chapters: [
      {
        title: 'Introduction',
        number: 1,
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
          {
            title: 'Chapter Overview',
            videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
            videoIds: ['2'],
          },
          {
            title: 'Discussion Prompt',
            videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
            videoIds: ['2'],
          },
        ],
      },
      {
        title: 'Epilogue',
        number: 2,
        sections: [
          {
            title: 'This is the end',
            number: 1,
            videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
            videoIds: ['2'],
          },
        ],
      },
    ],
  });
};
