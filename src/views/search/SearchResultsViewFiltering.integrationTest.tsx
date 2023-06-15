import {
  ChannelFactory,
  FakeBoclipsClient,
  SubjectFactory,
} from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import {
  FacetFactory,
  FacetsFactory,
} from 'boclips-api-client/dist/test-support/FacetsFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import React from 'react';
import dayjs from 'src/day-js';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';
import { QueryClient } from '@tanstack/react-query';

describe('SearchResultsFiltering', () => {
  let fakeClient: FakeBoclipsClient = new FakeBoclipsClient();
  let queryClient: QueryClient = new QueryClient();

  function renderSearchResultsView(initialEntries: string[]) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App
          reactQueryClient={queryClient}
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
        />
      </MemoryRouter>,
    );
  }

  afterEach(() => {
    fakeClient = new FakeBoclipsClient();
    queryClient = new QueryClient();
  });

  it('applies filters from url on load', async () => {
    fakeClient.videos.setFacets(
      FacetsFactory.sample({
        videoTypes: [
          FacetFactory.sample({ name: 'News', id: 'NEWS', hits: 1 }),
          FacetFactory.sample({ name: 'Stock', id: 'STOCK', hits: 1 }),
        ],
      }),
    );

    fakeClient.videos.insertVideo(
      VideoFactory.sample({
        id: '1',
        title: 'stock video',
        types: [{ name: 'STOCK', id: 1 }],
      }),
    );
    fakeClient.videos.insertVideo(
      VideoFactory.sample({
        id: '2',
        title: 'news video',
        types: [{ name: 'NEWS', id: 2 }],
      }),
    );

    const wrapper = renderSearchResultsView([
      '/videos?q=video&video_type=STOCK',
    ]);

    const stockCheckbox = await wrapper.findByTestId('STOCK-checkbox');
    expect(stockCheckbox).toHaveProperty('checked', true);
  });

  describe('video type filters', () => {
    it('displays the video type filters and facet counts', async () => {
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'stock video',
          types: [{ name: 'STOCK', id: 1 }],
        }),
      );

      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          videoTypes: [
            FacetFactory.sample({ name: 'News', id: 'NEWS', hits: 1234321 }),
            FacetFactory.sample({
              name: 'instructional',
              id: 'INSTRUCTIONAL',
              hits: 888,
            }),
            FacetFactory.sample({ name: 'stock', id: 'STOCK', hits: 666 }),
          ],
        }),
      );

      const wrapper = renderSearchResultsView(['/videos?q=video']);

      expect(await wrapper.findByText('Video type')).toBeInTheDocument();
      expect(await wrapper.findByText('Instructional')).toBeInTheDocument();
      expect(await wrapper.findByText('Stock Footage')).toBeInTheDocument();
      expect(await wrapper.findByText('News')).toBeInTheDocument();

      expect(await wrapper.findByText('888')).toBeInTheDocument();
      expect(await wrapper.findByText('666')).toBeInTheDocument();
      expect(await wrapper.findByText('1234321')).toBeInTheDocument();
    });

    it('can filter videos by type', async () => {
      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          videoTypes: [
            FacetFactory.sample({ id: 'STOCK', hits: 1, name: 'STOCK' }),
            FacetFactory.sample({ id: 'NEWS', hits: 1, name: 'NEWS' }),
          ],
        }),
      );
      const videos = [
        VideoFactory.sample({
          id: '1',
          title: 'stock video',
          types: [{ name: 'STOCK', id: 1 }],
        }),
        VideoFactory.sample({
          id: '2',
          title: 'news video',
          types: [{ name: 'NEWS', id: 2 }],
        }),
      ];

      videos.forEach((v) => fakeClient.videos.insertVideo(v));

      const wrapper = renderSearchResultsView(['/videos?q=video']);

      expect(await wrapper.findByText('Video type')).toBeInTheDocument();

      expect(wrapper.queryByText('Instructional')).toBeNull();
      expect(await wrapper.findByText('News')).toBeInTheDocument();
      expect(await wrapper.findByText('Stock Footage')).toBeInTheDocument();

      await waitFor(async () => {
        expect(await wrapper.findByText('news video')).toBeInTheDocument();
        expect(await wrapper.findByText('stock video')).toBeInTheDocument();
      });

      const newsCheckbox = wrapper.getByTestId('NEWS-checkbox');

      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          videoTypes: [
            FacetFactory.sample({ name: 'NEWS', id: 'NEWS', hits: 10 }),
          ],
        }),
      );

      fireEvent.click(wrapper.getByTestId('NEWS-checkbox'));
      expect(newsCheckbox).toHaveProperty('checked', true);

      await waitFor(() => {
        expect(wrapper.queryByText('Raw Footage')).toBeNull();
        expect(wrapper.queryByText('stock video')).toBeNull();
      });

      expect(await wrapper.findByLabelText('News')).toBeInTheDocument();
      expect(await wrapper.findByText('news video')).toBeInTheDocument();

      const selectedFiltersSection = wrapper.getByTestId('applied-filter-tags');

      await waitFor(() =>
        within(selectedFiltersSection).getByText('News'),
      ).then((it) => {
        expect(it).toBeVisible();
      });
    });
  });

  describe('channel filters', () => {
    it('can filter channel filter options', async () => {
      fakeClient.channels.insertFixture([
        ChannelFactory.sample({ id: 'getty-id', name: 'Getty' }),
        ChannelFactory.sample({ id: 'ted-id', name: 'Ted' }),
      ]);

      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          channels: [
            FacetFactory.sample({ id: 'ted-id', hits: 1, name: 'Ted' }),
            FacetFactory.sample({ id: 'getty-id', hits: 1, name: 'Getty' }),
          ],
        }),
      );
      const videos = [
        VideoFactory.sample({
          id: '1',
          title: 'shark video',
          channelId: 'getty-id',
        }),
        VideoFactory.sample({
          id: '2',
          title: 'whale video',
          channelId: 'ted-id',
        }),
      ];

      videos.forEach((v) => fakeClient.videos.insertVideo(v));

      const wrapper = renderSearchResultsView(['/videos?q=video']);

      expect(await wrapper.findByText('Channel')).toBeInTheDocument();

      expect(await wrapper.findByText('Getty')).toBeInTheDocument();
      expect(await wrapper.findByText('Ted')).toBeInTheDocument();

      act(() => {
        fireEvent.change(wrapper.getByPlaceholderText('Search...'), {
          target: { value: 'get' },
        });
      });
      expect(await wrapper.findByText('Get')).toHaveClass('font-medium');
      expect(wrapper.queryByText('Ted')).toBeNull();

      fireEvent.click(wrapper.getByTestId('getty-id-checkbox'));

      await waitFor(() => {
        expect(wrapper.queryByText('whale video')).toBeNull();
        expect(wrapper.queryByText('shark video')).toBeVisible();
      });
    });
  });

  describe('Best For filters', () => {
    it('displays the filter and facet counts, order by facet counts', async () => {
      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          bestForTags: [
            { id: 'hook', name: 'Hook', hits: 12 },
            { id: 'explainer', name: 'Explainer', hits: 22 },
          ],
        }),
      );

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'my video',
          bestFor: [{ label: 'Hook' }],
        }),
      );

      const wrapper = renderSearchResultsView(['/videos?q=video']);

      expect(await wrapper.findByText('Best for')).toBeVisible();

      const options = wrapper
        .getAllByRole('checkbox')
        .map((it) => it.closest('label'));
      expect(within(options[0]).getByText('Explainer')).toBeVisible();
      expect(within(options[1]).getByText('Hook')).toBeVisible();

      expect(await wrapper.findAllByTestId('option-hits')).toHaveLength(2);
      expect(wrapper.getAllByTestId('option-hits')[0]).toHaveTextContent('22');
      expect(wrapper.getAllByTestId('option-hits')[1]).toHaveTextContent('12');
    });
  });

  describe('Language filters', () => {
    it('displays the filter and facet counts, order by facet counts', async () => {
      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          languages: [
            { id: 'spa', name: 'Spanish', hits: 5 },
            { id: 'eng', name: 'English', hits: 12 },
          ],
        }),
      );

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'my english video',
          language: { code: 'eng', displayName: 'English' },
        }),
      );

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '2',
          title: 'my spanish video',
          language: { code: 'spa', displayName: 'Spanish' },
        }),
      );

      const wrapper = renderSearchResultsView(['/videos?q=video']);

      expect(await wrapper.findByText('Language')).toBeVisible();

      const options = wrapper
        .getAllByRole('checkbox')
        .map((it) => it.closest('label'));
      expect(within(options[0]).getByText('English')).toBeVisible();
      expect(within(options[1]).getByText('Spanish')).toBeVisible();

      expect(await wrapper.findAllByTestId('option-hits')).toHaveLength(2);
      expect(wrapper.getAllByTestId('option-hits')[0]).toHaveTextContent('12');
      expect(wrapper.getAllByTestId('option-hits')[1]).toHaveTextContent('5');

      fireEvent.click(wrapper.getByTestId('eng-checkbox'));

      await waitFor(() => {
        expect(wrapper.queryByText('my english video')).toBeVisible();
        expect(wrapper.queryByText('my spanish video')).toBeNull();
      });
    });
  });

  describe('Duration filters', () => {
    it('displays the duration filters and facet counts', async () => {
      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          durations: [
            { id: 'PT0S-PT1M', name: 'PT0S-PT1M', hits: 10 },
            { id: 'PT5M-PT10M', name: 'PT5M-PT10M', hits: 120 },
            { id: 'PT20M-PT24H', name: 'PT20M-PT24H', hits: 80 },
          ],
        }),
      );

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'stock video',
          types: [{ name: 'STOCK', id: 1 }],
        }),
      );

      const wrapper = renderSearchResultsView(['/videos?q=video']);

      expect(await wrapper.findByText('Duration')).toBeInTheDocument();

      expect(wrapper.getAllByTestId('option-hits')[0]).toHaveTextContent('10');
      expect(wrapper.getAllByTestId('option-hits')[1]).toHaveTextContent('120');
      expect(wrapper.getAllByTestId('option-hits')[2]).toHaveTextContent('80');

      expect(wrapper.getByText('Up to 1 min')).toBeInTheDocument();
      expect(wrapper.getByText('5 - 10 min')).toBeInTheDocument();
      expect(wrapper.getByText('20 min +')).toBeInTheDocument();
      expect(wrapper.queryByText('1 - 5 min')).not.toBeInTheDocument();
      expect(wrapper.queryByText('10 - 20 min')).not.toBeInTheDocument();
    });
  });

  describe('date filters', () => {
    it('shows the to and from date filters with placeholders', async () => {
      fakeClient.videos.insertVideo(VideoFactory.sample({ title: 'video123' }));

      const wrapper = renderSearchResultsView(['/videos?q=video123']);

      expect(await wrapper.findByText('Release date')).toBeVisible();
      expect(await wrapper.findByText('From:')).toBeVisible();
      expect(await wrapper.findByText('To:')).toBeVisible();

      expect(wrapper.getAllByPlaceholderText('DD-MM-YYYY')).toHaveLength(2);
    });

    it('gets the to and from filters from the URL', async () => {
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          title: 'video123',
          releasedOn: dayjs('2019-12-01').toDate(),
        }),
      );

      const toDate = '2020-12-01';
      const fromDate = '2018-12-01';
      const wrapper = renderSearchResultsView([
        `/videos?q=video&release_date_to=${toDate}&release_date_from=${fromDate}`,
      ]);

      const inputs = await wrapper.findAllByPlaceholderText('DD-MM-YYYY');

      expect(inputs[0].nextSibling).toHaveAttribute('value', '2018-12-01');
      expect(inputs[1].nextSibling).toHaveAttribute('value', '2020-12-01');
    });

    it('resets the date filter when clearing all filters', async () => {
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          title: 'video123',
          releasedOn: dayjs('2019-12-01').toDate(),
        }),
      );

      const toDate = '2020-12-01';
      const fromDate = '2018-12-01';
      const wrapper = renderSearchResultsView([
        `/videos?q=video&release_date_to=${toDate}&release_date_from=${fromDate}`,
      ]);

      const inputs = await wrapper.findAllByPlaceholderText('DD-MM-YYYY');

      expect(inputs[0].nextSibling).toHaveAttribute('value', '2018-12-01');
      expect(inputs[1].nextSibling).toHaveAttribute('value', '2020-12-01');

      fireEvent.click(await wrapper.findByText('Clear all'));

      expect(await wrapper.findAllByPlaceholderText('DD-MM-YYYY')).toHaveLength(
        2,
      );

      expect(inputs[0].nextSibling).not.toHaveAttribute('value');
      expect(inputs[1].nextSibling).not.toHaveAttribute('value');
    });

    it('filters by date when selecting changing the date in the filter', async () => {
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: 'video-1',
          title: 'old-video',
          releasedOn: new Date(2000, 10, 10),
        }),
      );

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: 'video-2',
          title: 'new-video',
          releasedOn: new Date(2025, 10, 10),
        }),
      );

      const wrapper = renderSearchResultsView(['/videos?q=video']);

      const fromDatePicker = await within(
        await wrapper.findByTestId('release_date_from'),
      ).findByPlaceholderText('DD-MM-YYYY');

      fireEvent.focus(fromDatePicker);
      userEvent.type(fromDatePicker, '01-01-2020 {enter}');

      await waitFor(async () => {
        expect(await wrapper.findByText('new-video')).toBeVisible();
        expect(wrapper.queryByText('old-video')).not.toBeInTheDocument();
      });

      expect(await wrapper.findByText('From: 01-01-2020')).toBeVisible();
    });
  });

  describe('selected filters', () => {
    beforeEach(() => {
      fakeClient = new FakeBoclipsClient();

      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          languages: [
            { id: 'glv', hits: 1, name: 'Manx' },
            { id: 'jpn', hits: 1, name: 'Japanese' },
          ],
        }),
      );

      const videos = [
        VideoFactory.sample({
          id: '1',
          title: 'manx video',
          types: [{ name: 'STOCK', id: 1 }],
          language: { code: 'glv', displayName: 'Manx' },
        }),
        VideoFactory.sample({
          id: '2',
          title: 'japanese video',
          types: [{ name: 'NEWS', id: 2 }],
          language: { code: 'jpn', displayName: 'Japanese' },
        }),
      ];

      videos.forEach((v) => fakeClient.videos.insertVideo(v));
    });

    it('can remove filters individually from selected filter panel', async () => {
      const wrapper = renderSearchResultsView(['/videos?&language=glv']);

      await waitFor(async () => {
        expect(await wrapper.findByText('manx video')).toBeInTheDocument();
        expect(await wrapper.queryByText('japanese video')).toBeNull();
      });

      const selectedFiltersSection = await wrapper.findByTestId(
        'applied-filter-tags',
      );

      await waitFor(() =>
        within(selectedFiltersSection).getByText('Manx'),
      ).then((it) => {
        fireEvent.click(within(it).getByTestId('remove-filter-glv'));
      });

      await waitFor(() => {
        expect(wrapper.queryByText('Selected filters')).toBeNull();
      });

      await waitFor(async () => {
        expect(await wrapper.findByText('manx video')).toBeInTheDocument();
        expect(await wrapper.findByText('japanese video')).toBeInTheDocument();
      });
    });

    it('can remove all filters from selected filters panel', async () => {
      const wrapper = renderSearchResultsView(['/videos?q=video&language=glv']);

      await waitFor(async () => {
        expect(await wrapper.findByText('manx video')).toBeInTheDocument();
        expect(await wrapper.queryByText('japanese video')).toBeNull();
      });

      fireEvent.click(await wrapper.findByText('Clear all'));

      await waitFor(() => {
        expect(wrapper.queryByText('Selected filters')).toBeNull();
      });

      await waitFor(async () => {
        expect(await wrapper.findByText('manx video')).toBeInTheDocument();
        expect(await wrapper.findByText('japanese video')).toBeInTheDocument();
      });
    });
  });

  describe('content package filter', () => {
    beforeEach(() => {
      fakeClient = new FakeBoclipsClient();
      const englishSubject = SubjectFactory.sample({
        id: '123',
        name: 'english',
      });
      const frenchSubject = SubjectFactory.sample({
        id: '456',
        name: 'french',
      });
      const videos = [
        VideoFactory.sample({
          id: '1',
          title: 'stock video',
          types: [{ name: 'STOCK', id: 1 }],
        }),
        VideoFactory.sample({
          id: '2',
          title: 'news video',
          subjects: [englishSubject],
          types: [{ name: 'NEWS', id: 2 }],
        }),

        VideoFactory.sample({
          id: '3',
          title: 'french news video',
          subjects: [frenchSubject],
          types: [{ name: 'NEWS', id: 2 }],
        }),
      ];
      fakeClient.subjects.insertSubject(englishSubject);
      fakeClient.subjects.insertSubject(frenchSubject);

      videos.forEach((v) => fakeClient.videos.insertVideo(v));
      fakeClient.contentPackages.create({
        id: 'abc',
        name: 'my content package to preview',
        accessRules: [{ type: 'IncludedVideos', videoIds: ['2', '3'] }],
        accountsConnected: [],
      });
      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          subjects: [
            {
              id: frenchSubject.id,
              hits: 10,
              name: frenchSubject.name,
            },
          ],
        }),
      );

      const disciplines: Discipline[] = [
        {
          id: 'discipline-1',
          name: 'Discipline 1',
          code: 'discipline-1',
          subjects: [
            {
              id: '123',
              name: 'english',
            },
            {
              id: frenchSubject.id,
              name: frenchSubject.name,
            },
          ],
        },
      ];

      disciplines.forEach((discipline) =>
        fakeClient.disciplines.insertMyDiscipline(discipline),
      );
    });

    it('displays the content package preview banner', async () => {
      const wrapper = renderSearchResultsView(['/videos?&content_package=abc']);

      expect(await wrapper.findByText('news video')).toBeInTheDocument();
      expect(await wrapper.queryByText('stock video')).toBeNull();

      await waitFor(() =>
        expect(wrapper.getByRole('banner')).toHaveTextContent(
          'You’re now previewing: my content package to preview',
        ),
      );
    });

    it(`can apply additional filters`, async () => {
      const wrapper = renderSearchResultsView([
        '/videos?q=video&content_package=abc',
      ]);

      const subjectsFilterPanel = await wrapper.findByText('Subjects');
      expect(subjectsFilterPanel).toBeVisible();

      const disciplineButton = wrapper.getByLabelText('Discipline 1');
      expect(disciplineButton).toBeVisible();
      fireEvent.click(disciplineButton);

      expect(await wrapper.findByText('news video')).toBeInTheDocument();
      expect(await wrapper.findByText('french news video')).toBeInTheDocument();
      expect(await wrapper.queryByText('stock video')).toBeNull();

      await waitFor(() =>
        expect(wrapper.getByRole('banner')).toHaveTextContent(
          'You’re now previewing: my content package to preview',
        ),
      );

      const subjectCheckbox = wrapper.getByRole('checkbox', {
        name: 'french',
      });

      fireEvent.click(subjectCheckbox);

      await waitFor(async () => {
        expect(wrapper.getByText('french news video')).toBeInTheDocument();
        expect(wrapper.queryByText('news video')).toBeNull();
        expect(wrapper.queryByText('stock video')).toBeNull();
        expect(wrapper.getByRole('banner')).toHaveTextContent(
          'You’re now previewing: my content package to preview',
        );
      });
    });
  });

  describe('education level filters', () => {
    it('displays education level filters with facet counts', async () => {
      const facets = FacetsFactory.sample({
        educationLevels: [
          {
            hits: 22,
            id: 'EL1',
            name: 'EL1 label',
          },
          {
            hits: 33,
            id: 'EL2',
            name: 'EL2 label',
          },
        ],
      });

      const videos = [
        VideoFactory.sample({
          id: '1',
          title: 'hello 1',
        }),
        VideoFactory.sample({
          title: '2',
          description: 'hello 2',
        }),
      ];

      fakeClient.users.insertCurrentUser(UserFactory.sample());
      videos.forEach((v) => {
        fakeClient.videos.insertVideo(v);
      });
      fakeClient.videos.setFacets(facets);

      const wrapper = renderSearchResultsView(['/videos?q=hello']);

      await waitFor(() => {
        expect(wrapper.getByText('Education Level')).toBeInTheDocument();

        expect(wrapper.getByText('EL1 label')).toBeInTheDocument();
        expect(wrapper.getByTestId('EL1-checkbox')).toBeInTheDocument();

        expect(wrapper.getByText('EL2 label')).toBeInTheDocument();
        expect(wrapper.getByTestId('EL2-checkbox')).toBeInTheDocument();
      });
    });
  });

  describe('search topic filters', () => {
    const setupFacetsAndVideos = (client: FakeBoclipsClient) => {
      const facets = FacetsFactory.sample({
        topics: [
          {
            hits: 22,
            score: 5.0,
            id: 'boats',
            name: 'boats',
          },
          {
            hits: 33,
            score: 13.0,
            id: 'cars',
            name: 'cars',
          },
        ],
      });

      client.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'hello cars stock',
          topics: ['cars'],
          types: [{ name: 'STOCK', id: 1 }],
        }),
      );
      client.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'hello boats stock',
          topics: ['boats'],
          types: [{ name: 'STOCK', id: 1 }],
        }),
      );
      client.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'hello cars news',
          topics: ['cars'],
          types: [{ name: 'NEWS', id: 2 }],
        }),
      );
      client.videos.setFacets(facets);
    };

    it('displays search topic filters, ordered by score', async () => {
      setupFacetsAndVideos(fakeClient);
      const wrapper = renderSearchResultsView(['/videos?q=news']);
      await waitFor(() => {
        expect(wrapper.getAllByTestId('search-topic')[0]).toHaveTextContent(
          'cars',
        );
        expect(wrapper.getAllByTestId('search-topic')[1]).toHaveTextContent(
          'boats',
        );
      });
    });

    it('can filter by search topic', async () => {
      setupFacetsAndVideos(fakeClient);
      const wrapper = renderSearchResultsView(['/videos?q=stock']);
      await waitFor(() => {
        expect(wrapper.getByText('hello cars stock')).toBeInTheDocument();
        expect(wrapper.getByText('hello boats stock')).toBeInTheDocument();
      });

      fireEvent.click(wrapper.getByText('cars'));

      await waitFor(() => {
        expect(wrapper.getByText('hello cars stock')).toBeVisible();
        expect(wrapper.queryByText('hello boats stock')).toBeNull();
      });
    });

    it(`persists search topics on clearing all filters`, async () => {
      setupFacetsAndVideos(fakeClient);

      const wrapper = renderSearchResultsView([
        '/videos?q=hello&video_type=NEWS',
      ]);
      await waitFor(() => {
        expect(wrapper.getByText('hello cars news')).toBeInTheDocument();
        expect(wrapper.queryByText('hello boats stock')).toBeNull();
        expect(wrapper.queryByText('hello cars stock')).toBeNull();
      });

      fireEvent.click(wrapper.getByText('cars'));

      await waitFor(() => {
        expect(wrapper.getByText('hello cars news')).toBeInTheDocument();
        expect(wrapper.queryByText('hello boats news')).toBeNull();
        expect(wrapper.queryByText('hello boats stock')).toBeNull();
      });

      fireEvent.click(wrapper.getByText('Clear all'));

      await waitFor(() => {
        expect(wrapper.getByText('hello cars news')).toBeVisible();
        expect(wrapper.getByText('hello cars stock')).toBeVisible();
      });
    });
  });

  describe('CEFR level filters', () => {
    it('displays CEFR level filters with facet counts', async () => {
      const facets = FacetsFactory.sample({
        cefrLevels: [
          {
            hits: 22,
            id: 'A1',
            name: 'A1',
          },
          {
            hits: 33,
            id: 'B2',
            name: 'B2',
          },
        ],
      });

      const videos = [
        VideoFactory.sample({
          id: '1',
          title: 'hello 1',
        }),
        VideoFactory.sample({
          title: '2',
          description: 'hello 2',
        }),
      ];

      videos.forEach((v) => {
        fakeClient.videos.insertVideo(v);
      });
      fakeClient.videos.setFacets(facets);

      const wrapper = renderSearchResultsView(['/videos?q=hello']);

      await waitFor(() => {
        const cefrLevelButton = wrapper.getByRole('button', {
          name: 'CEFR Language Level filter panel',
        });
        expect(cefrLevelButton).toBeInTheDocument();
        expect(
          within(cefrLevelButton).getByText('CEFR Language Level'),
        ).toBeInTheDocument();

        expect(
          wrapper.getByRole('checkbox', { name: 'A1 Beginner' }),
        ).toBeInTheDocument();

        expect(
          wrapper.getByRole('checkbox', { name: 'B2 Upper Intermediate' }),
        ).toBeInTheDocument();
      });
    });

    it('can filter cefr level query param and selects checkbox', async () => {
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'hello cars stock',
          cefrLevel: 'B2',
        }),
      );
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '2',
          title: 'hello cars badger',
          cefrLevel: 'B1',
        }),
      );
      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          cefrLevels: [{ name: 'B1', id: 'B1', hits: 10 }],
        }),
      );

      const wrapper = renderSearchResultsView(['/videos?q=cars&cefr_level=B1']);

      await waitFor(() => {
        expect(wrapper.getByText('hello cars badger')).toBeVisible();
      });

      expect(wrapper.queryByText('hello cars stock')).not.toBeInTheDocument();
      expect(
        await wrapper.findByRole('checkbox', { name: 'B1 Intermediate' }),
      ).toHaveProperty('checked', true);

      const selectedFilterPanel = wrapper.getByRole('region', {
        name: 'Selected filters panel',
      });
      expect(
        await within(selectedFilterPanel).findByText('B1 Intermediate'),
      ).toBeVisible();
    });

    it('can filter cefr level query param and selects checkbox', async () => {
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'hello cars stock',
          cefrLevel: 'B2',
        }),
      );
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '2',
          title: 'hello cars badger',
          cefrLevel: 'B1',
        }),
      );
      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          cefrLevels: [{ name: 'B1', id: 'B1', hits: 10 }],
        }),
      );

      const wrapper = renderSearchResultsView(['/videos?q=cars']);

      await waitFor(() => {
        expect(wrapper.getByText('hello cars badger')).toBeVisible();
        expect(wrapper.getByText('hello cars stock')).toBeVisible();
      });

      const b1Checkbox = await wrapper.findByRole('checkbox', {
        name: 'B1 Intermediate',
      });
      expect(b1Checkbox).toHaveProperty('checked', false);
      fireEvent.click(b1Checkbox);

      await waitFor(() => {
        expect(wrapper.getByText('hello cars badger')).toBeVisible();
        expect(wrapper.queryByText('hello cars stock')).not.toBeInTheDocument();
      });

      expect(
        wrapper.getByRole('checkbox', {
          name: 'B1 Intermediate',
        }),
      ).toHaveProperty('checked', true);
    });
  });

  describe(`filtering by clicking content partner name in video card`, () => {
    it(`can filter by content partner by clicking their name in video card`, async () => {
      fakeClient.channels.insertFixture([
        ChannelFactory.sample({ id: 'ted-id', name: 'Ted' }),
        ChannelFactory.sample({ id: 'getty-id', name: 'Getty' }),
      ]);
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'video getty stock',
          channelId: 'getty-id',
          createdBy: 'Getty',
          types: [{ name: 'STOCK', id: 1 }],
        }),
      );
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'video ted stock',
          channelId: 'ted-id',
          createdBy: 'TED',
          types: [{ name: 'STOCK', id: 1 }],
        }),
      );
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'video getty news',
          channelId: 'getty-id',
          createdBy: 'Getty',
          types: [{ name: 'NEWS', id: 2 }],
        }),
      );
      const wrapper = renderSearchResultsView([
        '/videos?q=video&video_type=STOCK',
      ]);
      await waitFor(() => {
        expect(wrapper.getByText('video ted stock')).toBeInTheDocument();
        expect(wrapper.getByText('video getty stock')).toBeInTheDocument();
        expect(wrapper.queryByText('video getty news')).toBeNull();
      });

      fireEvent.click(wrapper.getByText('Getty'));

      await waitFor(() => {
        expect(wrapper.getByText('video getty stock')).toBeInTheDocument();
        expect(wrapper.queryByText('video ted stock')).toBeNull();
        expect(wrapper.queryByText('video getty news')).toBeNull();
      });
    });
  });

  describe('Discipline Subject filters', () => {
    const disciplines: Discipline[] = [
      {
        id: 'discipline-1',
        name: 'Discipline 1',
        code: 'discipline-1',
        subjects: [
          {
            id: 'history',
            name: 'History',
          },
          {
            id: 'art-history',
            name: 'Art history',
          },
        ],
      },
    ];

    it(`displays the number of subject selected by discipline if any`, async () => {
      fakeClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });

      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          subjects: [{ id: 'history', name: 'History', hits: 12 }],
        }),
      );

      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'history video',
          types: [{ name: 'STOCK', id: 1 }],
        }),
      );

      disciplines.forEach((discipline) => {
        fakeClient.disciplines.insertMyDiscipline(discipline);
      });

      const wrapper = render(
        <MemoryRouter initialEntries={['/videos']}>
          <App
            apiClient={fakeClient}
            boclipsSecurity={stubBoclipsSecurity}
            reactQueryClient={new QueryClient()}
          />
        </MemoryRouter>,
      );

      const subjectsFilterPanel = await wrapper.findByText('Subjects');
      expect(subjectsFilterPanel).toBeVisible();

      const disciplineButton = wrapper.getByLabelText('Discipline 1');
      expect(disciplineButton).toBeVisible();
      fireEvent.click(disciplineButton);

      expect(
        wrapper.getByLabelText('Discipline 1').getAttribute('aria-expanded'),
      ).toBe('true');

      const historySubjectCheckbox = wrapper.getByRole('checkbox', {
        name: 'History',
      });

      expect(historySubjectCheckbox).toBeVisible();

      fireEvent.click(historySubjectCheckbox);

      expect(
        wrapper.getByLabelText('1 subject selected under Discipline 1'),
      ).toBeVisible();
    });
  });

  describe('no results', () => {
    it('shows a no results page without filters', async () => {
      const wrapper = renderSearchResultsView(['/videos?q=shark']);

      expect(
        await wrapper.findByText('We couldn’t find any videos for “shark”'),
      ).toBeVisible();
    });

    it('shows a no results page with filters', async () => {
      const video = VideoFactory.sample({
        id: '1',
        title: 'log',
        types: [{ name: 'STOCK', id: 1 }],
      });

      fakeClient.videos.insertVideo(video);

      const wrapper = renderSearchResultsView([
        '/videos?q=log&page=1&video_type=NEWS',
      ]);

      expect(
        await wrapper.findByText(
          'We couldn’t find any videos for “log” with your filter selection',
        ),
      ).toBeVisible();
    });
  });

  describe('video subtype filters', () => {
    it('displays video subtype filters with facet counts', async () => {
      const facets = FacetsFactory.sample({
        videoSubtypes: [
          {
            hits: 2,
            id: 'ANIMATION',
            name: 'Animation',
          },
          {
            hits: 3,
            id: 'INTERVIEW',
            name: 'Interview',
          },
        ],
      });

      const videos = [
        VideoFactory.sample({
          id: '1',
          title: 'hello 1',
          contentCategories: [{ key: 'INTERVIEW', label: 'Interview' }],
        }),
        VideoFactory.sample({
          title: '2',
          description: 'hello 2',
          contentCategories: [{ key: 'ANIMATION', label: 'Animation' }],
        }),
      ];

      videos.forEach((v) => {
        fakeClient.videos.insertVideo(v);
      });
      fakeClient.videos.setFacets(facets);

      const wrapper = renderSearchResultsView(['/videos?q=hello']);

      await waitFor(() => {
        expect(wrapper.getByText('Video subtype')).toBeVisible();
      });

      expect(wrapper.getByText('Animation')).toBeInTheDocument();
      expect(wrapper.getByTestId('ANIMATION-checkbox')).toBeInTheDocument();

      expect(wrapper.getByText('Interview')).toBeInTheDocument();
      expect(wrapper.getByTestId('INTERVIEW-checkbox')).toBeInTheDocument();
    });

    it('can filter by video subtype and selects checkbox', async () => {
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '1',
          title: 'animation video',
          contentCategories: [{ key: 'ANIMATION', label: 'Animation' }],
        }),
      );
      fakeClient.videos.insertVideo(
        VideoFactory.sample({
          id: '2',
          title: 'interview video',
          contentCategories: [{ key: 'INTERVIEW', label: 'Interview' }],
        }),
      );
      fakeClient.videos.setFacets(
        FacetsFactory.sample({
          videoSubtypes: [{ name: 'Animation', id: 'ANIMATION', hits: 10 }],
        }),
      );

      const wrapper = renderSearchResultsView(['/videos?q=video']);

      await waitFor(() => {
        expect(wrapper.getByText('animation video')).toBeVisible();
        expect(wrapper.getByText('interview video')).toBeVisible();
        expect(wrapper.getByText('Video subtype')).toBeVisible();
      });

      const animationCheckbox = wrapper.getByRole('checkbox', {
        name: 'Animation',
      });
      expect(animationCheckbox).toHaveProperty('checked', false);
      fireEvent.click(animationCheckbox);

      await waitFor(() => {
        expect(wrapper.getByText('animation video')).toBeVisible();
        expect(wrapper.queryByText('interview video')).not.toBeInTheDocument();
      });

      expect(
        wrapper.getByRole('checkbox', {
          name: 'Animation',
        }),
      ).toHaveProperty('checked', true);
    });
  });
});
