import { fireEvent, waitFor } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from 'src/testSupport/render';
import { Search } from 'src/components/searchBar/SearchBar';
import { MemoryRouter } from 'react-router-dom';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('SearchBar', () => {
  it('renders with search button displayed', () => {
    const search = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <Search size="big" showIconOnly={false} />
      </BoclipsClientProvider>,
    );

    expect(search.queryByText('Search')).toBeInTheDocument();
  });

  it("new search strips out all URL query parameters except 'q' one", async () => {
    const wrapper = render(
      <MemoryRouter
        initialEntries={[
          '/videos?q=dogs&page=5&video_type=INSTRUCTIONAL&duration=PT1M-PT5M',
        ]}
      >
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <Search size="big" showIconOnly={false} />
        </BoclipsClientProvider>
      </MemoryRouter>,
    );

    expect((await wrapper.findByText('Search')).textContent).toEqual('Search');

    const searchInput = wrapper.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'cats' } });

    const searchButton = wrapper.getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith({
        pathname: '/videos',
        search: 'q=cats&page=1&video_type=INSTRUCTIONAL&duration=PT1M-PT5M',
      });
    });
  });
});
