import { fireEvent, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from 'src/testSupport/render';
import { Search } from 'src/components/searchBar/SearchBar';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { lastEvent } from 'src/testSupport/lastEvent';
import { SearchQueryCompletionsSuggestedRequest } from 'boclips-api-client/dist/sub-clients/events/model/SearchQueryCompletionsSuggestedRequest';
import { sleep } from 'src/testSupport/sleep';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';

describe('SearchBar', () => {
  it('renders with search button displayed', () => {
    const search = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <Search showIconOnly={false} />
      </BoclipsClientProvider>,
    );

    expect(search.queryByText('Search')).toBeInTheDocument();
  });

  it('new search preserves URL query parameters except query, page, and topics', async () => {
    const history = createBrowserHistory();
    history.push({
      pathname:
        '/videos?q=dogs&page=5&video_type=INSTRUCTIONAL&duration=PT1M-PT5M&topics=blah',
    });

    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <Router history={history}>
          <Search showIconOnly={false} />
        </Router>
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
      fakeBoclipsClient.users.setCurrentUserFeatures({
        BO_WEB_APP_SEARCH_SUGGESTIONS: true,
      });

      fakeBoclipsClient.suggestions.populate({
        channels: [],
        subjects: [],
        suggestionTerm: 'U',
        phrases: ['U.S. Senate', 'U.S. Government'],
      });
    });

    it('display search suggestions on search change if user has feature', async () => {
      const wrapper = render(
        <BoclipsClientProvider client={fakeBoclipsClient}>
          <Router history={createBrowserHistory()}>
            <Search showIconOnly={false} />
          </Router>
        </BoclipsClientProvider>,
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
        <BoclipsClientProvider client={fakeBoclipsClient}>
          <Router history={createBrowserHistory()}>
            <Search showIconOnly={false} />
          </Router>
        </BoclipsClientProvider>,
      );

      const searchInput = wrapper.getByPlaceholderText(
        'Search for videos',
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'U' } });
      fireEvent.focus(searchInput);

      expect(await wrapper.findByText('.S. Government')).toBeInTheDocument();
      expect(await wrapper.findByText('.S. Senate')).toBeInTheDocument();
    });

    it(`does not display search auto-suggest (nor send events) if user does not have feature flag`, async () => {
      fakeBoclipsClient.users.setCurrentUserFeatures({
        BO_WEB_APP_SEARCH_SUGGESTIONS: false,
      });

      const wrapper = render(
        <BoclipsClientProvider client={fakeBoclipsClient}>
          <Router history={createBrowserHistory()}>
            <Search showIconOnly={false} />
          </Router>
        </BoclipsClientProvider>,
      );

      const searchInput = wrapper.getByPlaceholderText(
        'Search for videos',
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'U' } });
      fireEvent.focus(searchInput);

      await sleep(500);

      expect(searchInput.value).toEqual('U');
      expect(wrapper.queryByText('.S. Constitution')).toBeNull();
      expect(fakeBoclipsClient.events.getEvents()).toHaveLength(0);
    });

    it('sends an event when auto-suggest displayed', async () => {
      const wrapper = render(
        <BoclipsClientProvider client={fakeBoclipsClient}>
          <Router history={createBrowserHistory()}>
            <Search showIconOnly={false} />
          </Router>
        </BoclipsClientProvider>,
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
        <BoclipsClientProvider client={fakeBoclipsClient}>
          <Router history={createBrowserHistory()}>
            <Search showIconOnly={false} />
          </Router>
        </BoclipsClientProvider>,
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
