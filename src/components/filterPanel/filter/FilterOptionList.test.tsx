import React from 'react';
import { renderWithLocation } from '@src/testSupport/renderWithLocation';
import { FilterOptionFactory } from '@src/testSupport/FilterOptionFactory';
import { FilterOptionList } from '@components/filterPanel/filter/FilterOptionList';
import { fireEvent } from '@testing-library/react';
import { FilterOption } from '@src/types/FilterOption';

describe('FilterOptionList', () => {
  const createFixtures = (fixturesToCreate: number) => {
    const go = (index, createdOptions: FilterOption[]) => {
      if (index > 0) {
        createdOptions.push(
          FilterOptionFactory.sample({
            hits: index,
            id: `${index}-option`,
            label: <span>Option {index}</span>,
          }),
        );
        return go(index - 1, createdOptions);
      }
      return createdOptions;
    };
    return go(fixturesToCreate, []);
  };

  it('renders first 5 filter options with given order when none option is selected', () => {
    const panel = renderWithLocation(
      <FilterOptionList
        options={createFixtures(7)}
        onSelect={() => {}}
        selectedOptions={[]}
      />,
    );

    const childNodes = panel.getByTestId('filter-option-list').childNodes;
    expect(childNodes[0].textContent).toContain('Option 7');
    expect(childNodes[1].textContent).toContain('Option 6');
    expect(childNodes[2].textContent).toContain('Option 5');
    expect(childNodes[3].textContent).toContain('Option 4');
    expect(childNodes[4].textContent).toContain('Option 3');
    expect(childNodes[5]).toBeUndefined();
  });

  it("renders more than 5 filters when 'show more' button is clicked", () => {
    const panel = renderWithLocation(
      <FilterOptionList
        options={createFixtures(7)}
        onSelect={() => {}}
        selectedOptions={[]}
      />,
    );

    fireEvent.click(panel.getByText('Show all (7)'));

    const childNodes = panel.getByTestId('filter-option-list').childNodes;
    expect(childNodes[0].textContent).toContain('Option 7');
    expect(childNodes[1].textContent).toContain('Option 6');
    expect(childNodes[2].textContent).toContain('Option 5');
    expect(childNodes[3].textContent).toContain('Option 4');
    expect(childNodes[4].textContent).toContain('Option 3');
    expect(childNodes[5].textContent).toContain('Option 2');
    expect(childNodes[6].textContent).toContain('Option 1');
  });

  it('renders selected filters first', () => {
    const panel = renderWithLocation(
      <FilterOptionList
        options={createFixtures(7)}
        onSelect={() => {}}
        selectedOptions={['2-option']}
      />,
    );

    fireEvent.click(panel.getByText('Show all (7)'));

    const childNodes = panel.getByTestId('filter-option-list').childNodes;
    expect(childNodes[0].textContent).toContain('Option 2');
    expect(childNodes[1].textContent).toContain('Option 7');
    expect(childNodes[2].textContent).toContain('Option 6');
    expect(childNodes[3].textContent).toContain('Option 5');
    expect(childNodes[4].textContent).toContain('Option 4');
    expect(childNodes[5].textContent).toContain('Option 3');
    expect(childNodes[6].textContent).toContain('Option 1');
  });

  it('filters out options with zero hits', () => {
    const options = [
      FilterOptionFactory.sample({
        hits: 3,
        id: '3-option',
        label: <span>Option 3</span>,
      }),
      FilterOptionFactory.sample({
        hits: 0,
        id: '0-option',
        label: <span>Option 0</span>,
      }),
      FilterOptionFactory.sample({
        hits: 1,
        id: '1-option',
        label: <span>Option 1</span>,
      }),
    ];
    const panel = renderWithLocation(
      <FilterOptionList
        options={options}
        onSelect={() => {}}
        selectedOptions={['0-option']}
      />,
    );
    const childNodes = panel.getByTestId('filter-option-list').childNodes;
    expect(childNodes[0].textContent).toContain('Option 3');
    expect(childNodes[1].textContent).toContain('Option 1');
  });
});
