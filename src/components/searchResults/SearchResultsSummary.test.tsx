import { render } from '@testing-library/react';
import React from 'react';
import { SearchResultsSummary } from '@components/searchResults/SearchResultsSummary';

describe('SearchResultsSummary', () => {
  it("does not show the query if it's missing", () => {
    const wrapper = render(
      <SearchResultsSummary count={5} query={undefined} />,
    );

    expect(wrapper.container).toHaveTextContent('Showing 5 videos');
    expect(wrapper.container).not.toHaveTextContent('Showing 5 videos for ""');
  });

  it('does not show the query if is empty string', () => {
    const wrapper = render(<SearchResultsSummary count={5} query="" />);

    expect(wrapper.container).toHaveTextContent('Showing 5 videos');
    expect(wrapper.container).not.toHaveTextContent('Showing 5 videos for ""');
  });

  it('shows query if it was used', () => {
    const wrapper = render(<SearchResultsSummary count={5} query="cats" />);

    expect(wrapper.container).toHaveTextContent('Showing 5 videos for "cats"');
  });
});
