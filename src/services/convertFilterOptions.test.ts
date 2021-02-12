import { FilterOption } from 'src/types/FilterOption';
import { renderToStaticMarkup } from 'react-dom/server';
import { searchFilterOptions } from 'src/services/convertFilterOptions';
import { FilterOptionFactory } from '../testSupport/FilterOptionFactory';

describe(`convertFilterOptions`, () => {
  it(`filters and bolds matching parts of filter options name`, () => {
    const filterOptions: FilterOption[] = [
      FilterOptionFactory.sample({ name: 'elephant' }),
      FilterOptionFactory.sample({ name: 'elves' }),
      FilterOptionFactory.sample({ name: 'eagles' }),
    ];

    const options = searchFilterOptions(filterOptions, 'el');

    expect(options).toHaveLength(2);

    expect(renderToStaticMarkup(options[0].label)).toEqual(
      '<span><span class="font-medium">el</span>ephant</span>',
    );
    expect(renderToStaticMarkup(options[1].label)).toEqual(
      '<span><span class="font-medium">el</span>ves</span>',
    );
  });

  it(`preserves case when bolding matching filters`, () => {
    const filterOptions: FilterOption[] = [
      FilterOptionFactory.sample({ name: 'Elephant' }),
      FilterOptionFactory.sample({ name: 'Elves' }),
      FilterOptionFactory.sample({ name: 'eagles' }),
    ];

    const options = searchFilterOptions(filterOptions, 'el');

    expect(options).toHaveLength(2);

    expect(renderToStaticMarkup(options[0].label)).toEqual(
      '<span><span class="font-medium">El</span>ephant</span>',
    );
    expect(renderToStaticMarkup(options[1].label)).toEqual(
      '<span><span class="font-medium">El</span>ves</span>',
    );
  });
});
