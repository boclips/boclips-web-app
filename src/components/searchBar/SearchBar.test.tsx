import { fireEvent, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from 'src/testSupport/render';
import { Search } from 'src/components/searchBar/SearchBar';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { lastEvent } from 'src/testSupport/lastEvent';
import { SearchQueryCompletionsSuggestedRequest } from 'boclips-api-client/dist/sub-clients/events/model/SearchQueryCompletionsSuggestedRequest';
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

  it('display search suggestions on search change if user has feature', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.setCurrentUserFeatures({
      BO_WEB_APP_SEARCH_SUGGESTIONS: true,
    });

    const wrapper = render(
      <BoclipsClientProvider client={fakeBoclipsClient}>
        <Router history={createBrowserHistory()}>
          <Search showIconOnly={false} />
        </Router>
      </BoclipsClientProvider>,
    );

    fakeBoclipsClient.suggestions.populate({
      channels: [],
      subjects: [],
      suggestionTerm: 'U.S. ',
      phrases: ['U.S. Senate', 'U.S. Constitution'],
    });

    const searchInput = wrapper.getByPlaceholderText(
      'Search for videos',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'U.S.' } });
    fireEvent.focus(searchInput);

    expect(wrapper.queryByText('Constitution')).toBeNull();
    expect(await wrapper.findByText('Constitution')).toBeInTheDocument();
    expect(await wrapper.findByText('Senate')).toBeInTheDocument();
  });

  it('display search suggestions on search change for minimum of 1 character in query', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.setCurrentUserFeatures({
      BO_WEB_APP_SEARCH_SUGGESTIONS: true,
    });

    const wrapper = render(
      <BoclipsClientProvider client={fakeBoclipsClient}>
        <Router history={createBrowserHistory()}>
          <Search showIconOnly={false} />
        </Router>
      </BoclipsClientProvider>,
    );

    fakeBoclipsClient.suggestions.populate({
      channels: [],
      subjects: [],
      suggestionTerm: 'U',
      phrases: ['U.S. Senate', 'U.S. Government'],
    });

    const searchInput = wrapper.getByPlaceholderText(
      'Search for videos',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'U' } });
    fireEvent.focus(searchInput);

    expect(wrapper.queryByText('Constitution')).toBeNull();
    expect(await wrapper.findByText('.S. Government')).toBeInTheDocument();
    expect(await wrapper.findByText('.S. Senate')).toBeInTheDocument();
  });

  it(`does not display search auto-suggest if user does not have feature flag`, async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
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

    fakeBoclipsClient.suggestions.populate({
      channels: [],
      subjects: [],
      suggestionTerm: 'U.S. ',
      phrases: ['U.S. Senate', 'U.S. Constitution'],
    });

    const searchInput = wrapper.getByPlaceholderText(
      'Search for videos',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'U.S.' } });
    fireEvent.focus(searchInput);

    await waitFor(() => {
      expect(searchInput.value).toEqual('U.S.');
      expect(wrapper.queryByText('Constitution')).toBeNull();
    });
  });

  it('sends an event when auto-suggest displayed', async () => {
    const fakeBoclipsClient = new FakeBoclipsClient();
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

    fakeBoclipsClient.suggestions.populate({
      channels: [],
      subjects: [],
      suggestionTerm: 'U.S. ',
      phrases: ['U.S. Senate', 'U.S. Constitution'],
    });

    const searchInput = wrapper.getByPlaceholderText(
      'Search for videos',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'U.S.' } });
    fireEvent.focus(searchInput);

    await waitFor(() => {
      const suggestEvent = lastEvent(
        fakeBoclipsClient,
      ) as SearchQueryCompletionsSuggestedRequest;

      expect(suggestEvent?.impressions).toEqual([
        'U.S. Senate',
        'U.S. Constitution',
      ]);
      expect(suggestEvent?.searchQuery).toEqual('U.S.');
    });
  });
});
