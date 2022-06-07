import { fireEvent } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from 'src/testSupport/render';
import { Search } from 'src/components/searchBar/SearchBar';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
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
});
