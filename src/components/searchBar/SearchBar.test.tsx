import { fireEvent, render, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { Search } from 'src/components/searchBar/SearchBar';
import { MemoryRouter, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { lastEvent } from 'src/testSupport/lastEvent';
import { SearchQueryCompletionsSuggestedRequest } from 'boclips-api-client/dist/sub-clients/events/model/SearchQueryCompletionsSuggestedRequest';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';

describe('SearchBar', () => {
  it('renders with search button displayed', () => {
    const history = createBrowserHistory();

    const search = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient(queryClientConfig)}>
          <Router location={history.location} navigator={history}>
            <Search showIconOnly={false} />
          </Router>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect(search.queryByText('Search')).toBeInTheDocument();
  });

  it('new search preserves URL query parameters except query, page, and topics', async () => {
    const history = createBrowserHistory();

    history.push(
      '/videos?q=dogs&page=5&video_type=INSTRUCTIONAL&duration=PT1M-PT5M&topics=blah',
    );

    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient(queryClientConfig)}>
          <Router location={history.location} navigator={history}>
            <Search showIconOnly={false} />
          </Router>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    expect((await wrapper.findByText('Search')).textContent).toEqual('Search');

    const searchInput = wrapper.getByPlaceholderText(
      'Search for videos',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'cats' } });

    const searchButton = wrapper.getByText('Search');
    fireEvent.click(searchButton);

    expect(history.location.pathname).toEqual('/videos');
    expect(history.location.search).toEqual(
      '?q=cats&page=1&video_type=INSTRUCTIONAL&duration=PT1M-PT5M',
    );
  });

  describe('search suggestions', () => {
    let fakeBoclipsClient;
    beforeEach(() => {
      fakeBoclipsClient = new FakeBoclipsClient();

      fakeBoclipsClient.suggestions.populate({
        channels: [],
        subjects: [],
        suggestionTerm: 'U',
        phrases: ['U.S. Senate', 'U.S. Government'],
      });
    });

    it('display search suggestions on search change if user has feature', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={fakeBoclipsClient}>
            <QueryClientProvider client={new QueryClient(queryClientConfig)}>
              <Search showIconOnly={false} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const searchInput = wrapper.getByPlaceholderText(
        'Search for videos',
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'U' } });
      fireEvent.focus(searchInput);

      expect(await wrapper.findByText('.S. Government')).toBeInTheDocument();
      expect(await wrapper.findByText('.S. Senate')).toBeInTheDocument();
    });

    it('display search suggestions on search change for minimum of 1 character in query', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={fakeBoclipsClient}>
            <QueryClientProvider client={new QueryClient(queryClientConfig)}>
              <Search showIconOnly={false} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const searchInput = wrapper.getByPlaceholderText(
        'Search for videos',
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'U' } });
      fireEvent.focus(searchInput);

      expect(await wrapper.findByText('.S. Government')).toBeInTheDocument();
      expect(await wrapper.findByText('.S. Senate')).toBeInTheDocument();
    });

    it('sends an event when auto-suggest displayed', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={fakeBoclipsClient}>
            <QueryClientProvider client={new QueryClient(queryClientConfig)}>
              <Search showIconOnly={false} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const searchInput = wrapper.getByPlaceholderText(
        'Search for videos',
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'U' } });
      fireEvent.focus(searchInput);

      await waitFor(() => {
        const suggestEvent = lastEvent(
          fakeBoclipsClient,
        ) as SearchQueryCompletionsSuggestedRequest;

        expect(suggestEvent?.impressions).toEqual([
          'U.S. Senate',
          'U.S. Government',
        ]);
        expect(suggestEvent?.searchQuery).toEqual('U');
      });
    });

    it('sends one final event when search is performed by using a suggestion', async () => {
      const wrapper = render(
        <MemoryRouter>
          <BoclipsClientProvider client={fakeBoclipsClient}>
            <QueryClientProvider client={new QueryClient(queryClientConfig)}>
              <Search showIconOnly={false} />
            </QueryClientProvider>
          </BoclipsClientProvider>
        </MemoryRouter>,
      );

      const searchInput = wrapper.getByPlaceholderText(
        'Search for videos',
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'U' } });
      fireEvent.focus(searchInput);

      expect(await wrapper.findByText('.S. Senate')).toBeInTheDocument();
      fireEvent.click(await wrapper.findByText('.S. Senate'));

      await waitFor(() => {
        const events: any[] = fakeBoclipsClient.events.getEvents();
        const searchRelatedEvent: SearchQueryCompletionsSuggestedRequest =
          events.find((e) => e.searchUrl);

        expect(searchRelatedEvent.searchQuery).toEqual('U');
        expect(searchRelatedEvent.impressions).toEqual([
          'U.S. Senate',
          'U.S. Government',
        ]);

        expect(searchRelatedEvent?.searchUrl).toContain(
          '/videos?q=U.S.+Senate&page=1',
        );
      });
    });
  });
});
