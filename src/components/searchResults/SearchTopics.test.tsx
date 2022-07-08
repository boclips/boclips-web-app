import { render } from '@testing-library/react';
import { SearchTopics } from 'src/components/searchResults/SearchTopics';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { FacetFactory } from 'boclips-api-client/dist/test-support/FacetsFactory';

describe('Search topics', () => {
  it('falls back to decoded topic id as name when it can not find a matching topic', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/videos?topics=aGVsbG8K']}>
        <SearchTopics
          topics={[FacetFactory.sample()]}
          handleFilterChange={jest.fn()}
        />
      </MemoryRouter>,
    );

    expect(wrapper.getByRole('button', { name: 'hello' })).toBeVisible();
  });
});
