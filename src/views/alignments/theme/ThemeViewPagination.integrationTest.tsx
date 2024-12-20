import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { resizeToDesktop } from 'src/testSupport/resizeTo';
import {
  chapterTitle,
  navigateTo,
  sectionTitle,
  setUpClientWithTheme,
  validateVisibleHeadings,
} from 'src/views/alignments/theme/ThemeTestSupport';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';

describe('Openstax book view pagination buttons', () => {
  describe('section navigation', () => {
    it('renders next and previous sections when clicking pagination buttons', async () => {
      resizeToDesktop();
      const theme = ThemeFactory.sample({
        id: 'ducklings',
        provider: 'openstax',
        title: 'Everything to know about ducks',
        type: 'Essentials',
        topics: [
          {
            title: 'Chapter 1: Introduction',
            index: 0,
            targets: [
              {
                index: 0,
                title: 'Chapter Overview',
                videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
                videoIds: ['2'],
              },
              {
                index: 1,
                title: 'Discussion Prompt',
                videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
                videoIds: ['2'],
              },
            ],
          },
        ],
      });

      const client = setUpClientWithTheme(theme);

      const wrapper = render(
        <MemoryRouter initialEntries={['/alignments/openstax/ducklings']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next');

      const bookDetails = wrapper.getByLabelText(
        'Content for Everything to know about ducks',
      );

      const nextChapterTitle = chapterTitle(bookDetails);
      const nextSectionTitle = sectionTitle(bookDetails);

      expect(nextChapterTitle).toBeVisible();
      expect(nextChapterTitle.textContent).toBe('Chapter 1: Introduction');

      expect(nextSectionTitle).toBeVisible();
      expect(nextSectionTitle.textContent).toBe('Discussion Prompt (1 video)');

      navigateTo(wrapper, 'Previous');

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
      const theme = ThemeFactory.sample({
        id: 'ducklings-2',
        provider: 'openstax',
        title: 'Everything to know about ducks',
        type: 'Essentials',
        topics: [
          {
            title: 'Chapter 1: Introduction',
            index: 0,
            targets: [
              {
                index: 0,
                title: 'Chapter Overview',
                videos: [VideoFactory.sample({ title: 'Baby ducks playing' })],
                videoIds: ['2'],
              },
              {
                index: 1,
                title: '1.99 Adventures outside',
                videos: [],
                videoIds: [],
              },
            ],
          },
        ],
      });

      const client = setUpClientWithTheme(theme);

      const wrapper = render(
        <MemoryRouter initialEntries={['/alignments/openstax/ducklings-2']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next');

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

      navigateTo(wrapper, 'Previous');

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
      const theme = ThemeFactory.sample({
        id: 'ducklings-3',
        provider: 'openstax',
        title: 'Everything to know about ducks',
        type: 'Essentials',
        topics: [
          {
            title: 'Chapter 1: Introduction',
            index: 0,
            targets: [
              {
                title: '1.1 The beginning',
                index: 0,
                videos: [],
                videoIds: [],
              },
            ],
          },
          {
            title: 'Chapter 2: Epilogue',
            index: 1,
            targets: [
              {
                title: '2.1 The end',
                index: 0,
                videos: [],
                videoIds: [],
              },
            ],
          },
        ],
      });

      const client = setUpClientWithTheme(theme);

      const wrapper = render(
        <MemoryRouter initialEntries={['/alignments/openstax/ducklings-3']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next');

      const bookDetails = wrapper.getByLabelText(
        'Content for Everything to know about ducks',
      );

      const nextChapterTitle = chapterTitle(bookDetails);
      const nextSectionTitle = sectionTitle(bookDetails);

      expect(nextChapterTitle).toBeVisible();
      expect(nextChapterTitle.textContent).toBe('Chapter 2: Epilogue');

      expect(nextSectionTitle).toBeVisible();
      expect(nextSectionTitle.textContent).toBe('2.1 The end (0 videos)');

      navigateTo(wrapper, 'Previous');

      const previousChapterTitle = chapterTitle(bookDetails);
      const previousSectionTitle = sectionTitle(bookDetails);

      expect(previousChapterTitle).toBeVisible();
      expect(previousChapterTitle.textContent).toBe('Chapter 1: Introduction');

      expect(previousSectionTitle).toBeVisible();
      expect(previousSectionTitle.textContent).toBe(
        '1.1 The beginning (0 videos)',
      );
    });

    it('navigation between chapters when chapter numeration is not continuous', async () => {
      resizeToDesktop();
      const theme = ThemeFactory.sample({
        id: 'ducklings-4',
        title: 'Everything to know about ducks',
        provider: 'openstax',
        type: 'Essentials',
        topics: [
          {
            title: 'Chapter 1: Introduction',
            index: 0,
            targets: [
              {
                title: '1.1 The beginning',
                index: 0,
                videos: [],
                videoIds: [],
              },
            ],
          },
          {
            title: 'Chapter 99: Epilogue',
            index: 1,
            targets: [
              {
                title: '99.1 The end',
                index: 0,
                videos: [],
                videoIds: [],
              },
            ],
          },
        ],
      });

      const client = setUpClientWithTheme(theme);

      const wrapper = render(
        <MemoryRouter initialEntries={['/alignments/openstax/ducklings-4']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next');

      const bookDetails = wrapper.getByLabelText(
        'Content for Everything to know about ducks',
      );

      const nextChapterTitle = chapterTitle(bookDetails);
      const nextSectionTitle = sectionTitle(bookDetails);

      expect(nextChapterTitle).toBeVisible();
      expect(nextChapterTitle.textContent).toBe('Chapter 99: Epilogue');

      expect(nextSectionTitle).toBeVisible();
      expect(nextSectionTitle.textContent).toBe('99.1 The end (0 videos)');

      navigateTo(wrapper, 'Previous');

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
      const theme = ThemeFactory.sample({
        id: 'ducklings-5',
        provider: 'openstax',
        title: 'Everything to know about ducks',
        type: 'Essentials',
        topics: [
          {
            title: 'Chapter 1: Introduction',
            index: 0,
            targets: [
              {
                title: '1.1 The beginning',
                index: 0,
                videos: [],
                videoIds: [],
              },
            ],
          },
          {
            title: 'Chapter 2: Epilogue',
            index: 1,
            targets: [
              {
                title: '2.1 The end',
                index: 0,
                videos: [],
                videoIds: [],
              },
            ],
          },
        ],
      });

      const client = setUpClientWithTheme(theme);

      const wrapper = render(
        <MemoryRouter initialEntries={['/alignments/openstax/ducklings-5']}>
          <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
        </MemoryRouter>,
      );

      const titles = await wrapper.findAllByRole('heading', {
        level: 1,
        name: /Everything to know about ducks/,
      });
      expect(titles).toHaveLength(2);

      navigateTo(wrapper, 'Next');

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
