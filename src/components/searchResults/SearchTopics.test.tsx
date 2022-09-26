import { render } from '@testing-library/react';
import { SearchTopics } from 'src/components/searchResults/SearchTopics';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { FacetFactory } from 'boclips-api-client/dist/test-support/FacetsFactory';

describe('Search topics', () => {
  it('falls back to decoded topic id as name when it can not find a matching topic', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={[`/videos?topics=${btoa('hello')}`]}>
        <SearchTopics
          topics={[FacetFactory.sample()]}
          handleFilterChange={jest.fn()}
        />
      </MemoryRouter>,
    );

    expect(
      wrapper.getByRole('button', { name: 'hello search topic' }),
    ).toBeVisible();
  });

  it('limits visible topics to given number', () => {
    const wrapper = render(
      <MemoryRouter
        initialEntries={[
          `/videos?topics=${btoa('selected-1')}&topics=${btoa('selected-2')}`,
        ]}
      >
        <SearchTopics
          topics={[
            FacetFactory.sample({ id: '2', name: 'not-selected-1', score: 20 }),
            FacetFactory.sample({ id: '3', name: 'not-selected-2', score: 10 }),
          ]}
          handleFilterChange={jest.fn()}
          maxVisibleTopics={3}
        />
      </MemoryRouter>,
    );

    expect(wrapper.getAllByRole('button')).toHaveLength(3);
    expect(
      wrapper.getByRole('button', { name: 'selected-1 search topic' }),
    ).toBeVisible();
    expect(
      wrapper.getByRole('button', { name: 'selected-2 search topic' }),
    ).toBeVisible();
    expect(
      wrapper.getByRole('button', { name: 'not-selected-1 search topic' }),
    ).toBeVisible();
  });

  it('only unselected topics should be visible when no topic already searched', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={[`/videos`]}>
        <SearchTopics
          topics={[
            FacetFactory.sample({ id: '2', name: 'not-selected-1', score: 20 }),
            FacetFactory.sample({ id: '3', name: 'not-selected-2', score: 10 }),
          ]}
          handleFilterChange={jest.fn()}
          maxVisibleTopics={3}
        />
      </MemoryRouter>,
    );

    expect(wrapper.getAllByRole('button')).toHaveLength(2);
    expect(
      wrapper.getByRole('button', { name: 'not-selected-1 search topic' }),
    ).toBeVisible();
    expect(
      wrapper.getByRole('button', { name: 'not-selected-2 search topic' }),
    ).toBeVisible();
  });
});
