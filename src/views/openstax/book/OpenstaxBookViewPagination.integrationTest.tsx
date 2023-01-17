import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { BookFactory } from 'boclips-api-client/dist/test-support/BookFactory';
import { resizeToDesktop } from 'src/testSupport/resizeTo';
import {
  chapterTitle,
  navigateTo,
  sectionTitle,
  setUpClientWithBook,
  validateVisibleHeadings,
} from 'src/views/openstax/book/OpenstaxBookTestSupport';

describe('Openstax book view pagination buttons', () => {
  describe('section navigation', () => {
    it('renders next and previous sections when clicking pagination buttons', async () => {
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
        ],
      });

      const client = setUpClientWithBook(book);

      const wrapper = render(
        <MemoryRouter initialEntries={['/sparks/openstax/ducklings']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next section');

      const bookDetails = wrapper.getByLabelText(
        'Content for Everything to know about ducks',
      );

      const nextChapterTitle = chapterTitle(bookDetails);
      const nextSectionTitle = sectionTitle(bookDetails);

      expect(nextChapterTitle).toBeVisible();
      expect(nextChapterTitle.textContent).toBe('Chapter 1: Introduction');

      expect(nextSectionTitle).toBeVisible();
      expect(nextSectionTitle.textContent).toBe('Discussion Prompt (1 video)');

      navigateTo(wrapper, 'Previous section');

      const previousChapterTitle = chapterTitle(bookDetails);
      const previousSectionTitle = sectionTitle(bookDetails);

      expect(previousChapterTitle).toBeVisible();
      expect(previousChapterTitle.textContent).toBe('Chapter 1: Introduction');

      expect(previousSectionTitle).toBeVisible();
      expect(previousSectionTitle.textContent).toBe(
        'Chapter Overview (1 video)',
      );

      client.clear();
    });

    it('renders next and previous sections even if section numeration is not continuous', async () => {
      resizeToDesktop();
      const book = BookFactory.sample({
        id: 'ducklings-2',
        title: 'Everything to know about ducks',
        subject: 'Essentials',
        chapters: [
          {
            title: 'Introduction',
            number: 1,
            sections: [
              {
                title: 'Chapter Overview',
                videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
                videoIds: ['2'],
              },
              {
                title: 'Adventures outside',
                number: 99,
                videos: [],
                videoIds: [],
              },
            ],
          },
        ],
      });

      const client = setUpClientWithBook(book);

      const wrapper = render(
        <MemoryRouter initialEntries={['/sparks/openstax/ducklings-2']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next section');

      const bookDetails = wrapper.getByLabelText(
        'Content for Everything to know about ducks',
      );

      const nextChapterTitle = chapterTitle(bookDetails);

      const nextSectionTitle = sectionTitle(bookDetails);

      expect(nextChapterTitle).toBeVisible();
      expect(nextChapterTitle).toHaveTextContent('Chapter 1: Introduction');

      expect(nextSectionTitle).toBeVisible();
      expect(nextSectionTitle).toHaveTextContent(
        '1.99 Adventures outside (0 videos)',
      );

      navigateTo(wrapper, 'Previous section');

      const previousChapterTitle = chapterTitle(bookDetails);
      const previousSectionTitle = sectionTitle(bookDetails);

      expect(previousChapterTitle).toBeVisible();
      expect(previousChapterTitle).toHaveTextContent('Chapter 1: Introduction');

      expect(previousSectionTitle).toBeVisible();
      expect(previousSectionTitle).toHaveTextContent(
        'Chapter Overview (1 video)',
      );
      client.clear();
    });
  });

  describe('chapters navigation', () => {
    it('navigation between chapters', async () => {
      resizeToDesktop();
      const book = BookFactory.sample({
        id: 'ducklings-3',
        title: 'Everything to know about ducks',
        subject: 'Essentials',
        chapters: [
          {
            title: 'Introduction',
            number: 1,
            sections: [
              {
                title: 'The beginning',
                number: 1,
                videos: [],
                videoIds: [],
              },
            ],
          },
          {
            title: 'Epilogue',
            number: 2,
            sections: [
              {
                title: 'The end',
                number: 1,
                videos: [],
                videoIds: [],
              },
            ],
          },
        ],
      });

      const client = setUpClientWithBook(book);

      const wrapper = render(
        <MemoryRouter initialEntries={['/sparks/openstax/ducklings-3']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next chapter');

      const bookDetails = wrapper.getByLabelText(
        'Content for Everything to know about ducks',
      );

      const nextChapterTitle = chapterTitle(bookDetails);
      const nextSectionTitle = sectionTitle(bookDetails);

      expect(nextChapterTitle).toBeVisible();
      expect(nextChapterTitle.textContent).toBe('Chapter 2: Epilogue');

      expect(nextSectionTitle).toBeVisible();
      expect(nextSectionTitle.textContent).toBe('2.1 The end (0 videos)');

      navigateTo(wrapper, 'Previous chapter');

      const previousChapterTitle = chapterTitle(bookDetails);
      const previousSectionTitle = sectionTitle(bookDetails);

      expect(previousChapterTitle).toBeVisible();
      expect(previousChapterTitle.textContent).toBe('Chapter 1: Introduction');

      expect(previousSectionTitle).toBeVisible();
      expect(previousSectionTitle.textContent).toBe(
        '1.1 The beginning (0 videos)',
      );
    });

    it('navigation between chapters when chapter numeration is not continous', async () => {
      resizeToDesktop();
      const book = BookFactory.sample({
        id: 'ducklings-4',
        title: 'Everything to know about ducks',
        subject: 'Essentials',
        chapters: [
          {
            title: 'Introduction',
            number: 1,
            sections: [
              {
                title: 'The beginning',
                number: 1,
                videos: [],
                videoIds: [],
              },
            ],
          },
          {
            title: 'Epilogue',
            number: 99,
            sections: [
              {
                title: 'The end',
                number: 1,
                videos: [],
                videoIds: [],
              },
            ],
          },
        ],
      });

      const client = setUpClientWithBook(book);

      const wrapper = render(
        <MemoryRouter initialEntries={['/sparks/openstax/ducklings-4']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next chapter');

      const bookDetails = wrapper.getByLabelText(
        'Content for Everything to know about ducks',
      );

      const nextChapterTitle = chapterTitle(bookDetails);
      const nextSectionTitle = sectionTitle(bookDetails);

      expect(nextChapterTitle).toBeVisible();
      expect(nextChapterTitle.textContent).toBe('Chapter 99: Epilogue');

      expect(nextSectionTitle).toBeVisible();
      expect(nextSectionTitle.textContent).toBe('99.1 The end (0 videos)');

      navigateTo(wrapper, 'Previous chapter');

      const previousChapterTitle = chapterTitle(bookDetails);
      const previousSectionTitle = sectionTitle(bookDetails);

      expect(previousChapterTitle).toBeVisible();
      expect(previousChapterTitle.textContent).toBe('Chapter 1: Introduction');

      expect(previousSectionTitle).toBeVisible();
      expect(previousSectionTitle.textContent).toBe(
        '1.1 The beginning (0 videos)',
      );
    });

    it('navigation panel has opened chapter 2 accordion when clicked next chapter button', async () => {
      resizeToDesktop();
      const book = BookFactory.sample({
        id: 'ducklings-5',
        title: 'Everything to know about ducks',
        subject: 'Essentials',
        chapters: [
          {
            title: 'Introduction',
            number: 1,
            sections: [
              {
                title: 'The beginning',
                number: 1,
                videos: [],
                videoIds: [],
              },
            ],
          },
          {
            title: 'Epilogue',
            number: 2,
            sections: [
              {
                title: 'The end',
                number: 1,
                videos: [],
                videoIds: [],
              },
            ],
          },
        ],
      });

      const client = setUpClientWithBook(book);

      const wrapper = render(
        <MemoryRouter initialEntries={['/sparks/openstax/ducklings-5']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next chapter');

      const bookToc = wrapper.getByLabelText(
        'Table of contents of Everything to know about ducks',
      );
      expect(bookToc).toBeVisible();
      validateVisibleHeadings(bookToc, 2, [
        'Chapter 1: Introduction',
        'Chapter 2: Epilogue',
      ]);
      validateVisibleHeadings(bookToc, 3, ['2.1 The end']);
    });
  });
});
