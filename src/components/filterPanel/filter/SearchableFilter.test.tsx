import { renderWithLocation } from '@src/testSupport/renderWithLocation';
import { fireEvent, RenderResult } from '@testing-library/react';
import React from 'react';
import { SearchableFilter } from '@components/filterPanel/filter/SearchableFilter';
import { FilterOption } from '@src/types/FilterOption';
import { FilterOptionFactory } from '@src/testSupport/FilterOptionFactory';

describe('searchableFilter', () => {
  const channels: FilterOption[] = [
    FilterOptionFactory.sample({
      id: 'channel-1',
      name: 'TED-ED',
      key: 'channel',
      label: <span>TED-ED</span>,
      hits: 10,
    }),
    FilterOptionFactory.sample({
      id: 'channel-2',
      key: 'channel',
      name: 'History channel',
      hits: 5,
    }),
    FilterOptionFactory.sample({
      id: 'channel-3',
      key: 'channel',
      name: 'geography',
      hits: 5,
    }),
    FilterOptionFactory.sample({
      id: 'channel-4',
      key: 'channel',
      name: 'science',
      hits: 5,
    }),
    FilterOptionFactory.sample({
      id: 'channel-5',
      key: 'channel',
      name: 'maths',
      hits: 5,
    }),
    FilterOptionFactory.sample({
      id: 'channel-6',
      key: 'channel',
      name: 'music',
      hits: 5,
    }),
  ];

  it('renders the search input with default placeholder when enabled', () => {
    const panel = renderWithLocation(
      <SearchableFilter
        options={channels}
        title="Video Types"
        filterName="test"
        handleChange={() => {}}
      />,
    );

    expect(getSearchInput(panel)).toBeInTheDocument();
  });

  it('filters and bolds options based on the search input', () => {
    const panel = renderWithLocation(
      <SearchableFilter
        options={channels}
        title="Video Types"
        filterName="test"
        handleChange={() => {}}
      />,
    );

    expect(panel.getByText('Show all (6)')).toBeInTheDocument();

    fireEvent.change(getSearchInput(panel), { target: { value: 'TED' } });

    expect(panel.queryByText('Show all (6)')).toBeNull();
    expect(panel.getByText('TED')).toHaveClass('font-medium');
    expect(panel.getByText('-ED')).toBeInTheDocument();
    expect(panel.queryByText('History channel')).not.toBeInTheDocument();
  });

  it('resets the filter search when toggling the filter', () => {
    const panel = renderWithLocation(
      <SearchableFilter
        options={channels}
        title="Channels"
        filterName="test"
        handleChange={() => {}}
      />,
    );

    fireEvent.change(getSearchInput(panel), {
      target: { value: 'Not valid channel' },
    });

    // Close and open the panel
    await userEvent.click(panel.getByText('Channels'));
    await userEvent.click(panel.getByText('Channels'));

    expect(getSearchInput(panel)).toBeVisible();
    expect(panel.getByText('TED-ED')).toBeInTheDocument();
  });

  const getSearchInput = (view: RenderResult) =>
    view.getByPlaceholderText('Search...');
});
