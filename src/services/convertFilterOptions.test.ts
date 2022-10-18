import { FilterOption } from 'src/types/FilterOption';
import { searchFilterOptions } from 'src/services/sortFilterOptions';
import { render } from '@testing-library/react';
import { FilterOptionFactory } from '../testSupport/FilterOptionFactory';

describe('convertFilterOptions', () => {
  it('filters and bolds matching parts of filter options name', () => {
    const filterOptions: FilterOption[] = [
      FilterOptionFactory.sample({ name: 'elephant' }),
      FilterOptionFactory.sample({ name: 'elves' }),
      FilterOptionFactory.sample({ name: 'eagles' }),
    ];

    const options = searchFilterOptions(filterOptions, 'el');

    expect(options).toHaveLength(2);
    const optionOne = render(options[0].label);
    const optionTwo = render(options[1].label);

    expect(optionOne.baseElement).toContainHTML(
      '<span class="font-medium">el</span>ephant',
    );
    expect(optionTwo.baseElement).toContainHTML(
      '<span class="font-medium">el</span>ves',
    );
  });

  it('preserves case when bolding matching filters', () => {
    const filterOptions: FilterOption[] = [
      FilterOptionFactory.sample({ name: 'Elephant' }),
      FilterOptionFactory.sample({ name: 'Elves' }),
      FilterOptionFactory.sample({ name: 'eagles' }),
    ];

    const options = searchFilterOptions(filterOptions, 'el');

    expect(options).toHaveLength(2);
    const optionOne = render(options[0].label);
    const optionTwo = render(options[1].label);

    expect(optionOne.baseElement).toContainHTML(
      '<span class="font-medium">El</span>ephant',
    );
    expect(optionTwo.baseElement).toContainHTML(
      '<span class="font-medium">El</span>ves',
    );
  });
});
