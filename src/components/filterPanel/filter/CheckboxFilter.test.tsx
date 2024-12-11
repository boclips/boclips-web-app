import React from 'react';
import { waitFor } from '@testing-library/react';
import { CheckboxFilter } from '@components/filterPanel/filter/CheckboxFilter';
import { renderWithLocation } from '@src/testSupport/renderWithLocation';
import { FilterOption } from '@src/types/FilterOption';
import { FilterOptionFactory } from '@src/testSupport/FilterOptionFactory';
import userEvent from "@testing-library/user-event";

describe('filterPanel', () => {
  const generateOptions = (optionNumber: number): FilterOption[] => {
    const options: FilterOption[] = [];
    for (let i = 0; i < optionNumber; i++) {
      options.push(
        FilterOptionFactory.sample({
          hits: 10 - i,
          id: `${i}-option`,
          label: <span>Option {i}</span>,
          name: `Option ${i}`,
        }),
      );
    }
    return options;
  };

  const videoTypes: FilterOption[] = [
    FilterOptionFactory.sample({
      hits: 10,
      key: 'video_type',
      id: 'stock',
      label: <span>Stock</span>,
      name: 'Stock',
    }),
    FilterOptionFactory.sample({
      hits: 5,
      key: 'video_type',
      id: 'news',
      label: <span>News</span>,
      name: 'News',
    }),
  ];

  it('renders the title, filters and facets provided', () => {
    const panel = renderWithLocation(
      <CheckboxFilter
        options={videoTypes}
        title="Video Types"
        filterName="test"
        handleChange={() => {}}
      />,
    );

    expect(panel.getByText('Video Types')).toBeInTheDocument();

    expect(panel.getByText('Stock')).toBeInTheDocument();
    expect(panel.getByText('10')).toBeInTheDocument();
    expect(panel.getByText('News')).toBeInTheDocument();
    expect(panel.getByText('5')).toBeInTheDocument();
    expect(panel.queryByText('Show all (2)')).toBeNull();
  });

  it('can hide the options if you collapse the panel', async () => {
    const panel = renderWithLocation(
      <CheckboxFilter
        options={videoTypes}
        title="Video Types"
        filterName="test"
        handleChange={() => {}}
      />,
    );

    await userEvent.click(panel.getByText('Video Types'));
    expect(panel.queryByText('Stock')).toBeNull();
    await userEvent.click(panel.getByText('Video Types'));
    expect(panel.getByText('Stock')).toBeVisible();
  });

  it('can uncheck an option and others remain checked', async () => {
    const panel = renderWithLocation(
      <CheckboxFilter
        options={videoTypes}
        title="Video Types"
        filterName="test"
        handleChange={() => {}}
      />,
    );

    await userEvent.click(panel.getByText('News'));
    await userEvent.click(panel.getByText('Stock'));

    await userEvent.click(panel.getByText('News'));

    const stockCheckbox = panel.getByTestId('stock-checkbox');
    waitFor(() => {
      expect(stockCheckbox).toHaveProperty('checked', true);
    });
  });

  it('renders a show more label with the correct number', () => {
    const panel = renderWithLocation(
      <CheckboxFilter
        options={generateOptions(6)}
        title="Video Types"
        filterName="test"
        handleChange={() => {}}
      />,
    );

    expect(panel.getByText('Show all (6)')).toBeVisible();
    expect(panel.getByText('Option 1')).toBeVisible();
    expect(panel.queryByText('Option 5')).toBeNull();
  });

  it('toggles the filter to show more results', async () => {
    const panel = renderWithLocation(
      <CheckboxFilter
        options={generateOptions(6)}
        title="Video Types"
        filterName="test"
        handleChange={() => {}}
      />,
    );

    expect(panel.queryByText('Option 5')).toBeNull();

    await userEvent.click(panel.getByText('Show all (6)'));

    expect(panel.queryByText('Option 5')).toBeVisible();
    expect(panel.getByText('Show less')).toBeVisible();
  });

  it('calls handleChanged on click', async () => {
    const changeHandler = vi.fn();

    const panel = renderWithLocation(
      <CheckboxFilter
        options={generateOptions(6)}
        title="Video Types"
        filterName="test"
        handleChange={changeHandler}
      />,
    );

    await userEvent.click(panel.getByRole('checkbox', { name: 'Option 2' }));
    expect(changeHandler).toHaveBeenCalledWith('test', ['2-option']);
  });
});
