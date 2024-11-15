import { render, within } from '@testing-library/react';
import React from 'react';
import { CefrLevelFilter } from '@src/components/filterPanel/CefrLevelFilter';
import { FilterOptionFactory } from '@src/testSupport/FilterOptionFactory';
import { renderWithLocation } from '@src/testSupport/renderWithLocation';

describe('CEFR level filter', () => {
  it('renders filter options in alphabetical order', () => {
    const wrapper = renderWithLocation(
      <CefrLevelFilter
        options={[
          FilterOptionFactory.sample({
            id: 'B1',
            name: 'B1 Intermediate',
            label: <span>B1 Intermediate</span>,
            hits: 4123,
            key: 'cefr_level',
          }),
          FilterOptionFactory.sample({
            id: 'A1',
            name: 'A1 Beginner',
            label: <span>A1 Beginner</span>,
            hits: 1,
            key: 'cefr_level',
          }),
          FilterOptionFactory.sample({
            id: 'C2',
            name: 'C2 Proficiency',
            label: <span>C2 Proficiency</span>,
            hits: 4,
            key: 'cefr_level',
          }),
          FilterOptionFactory.sample({
            id: 'A2',
            name: 'A2 Elementary',
            label: <span>A2 Elementary</span>,
            hits: 42,
            key: 'cefr_level',
          }),
          FilterOptionFactory.sample({
            id: 'B2',
            name: 'B2 Upper Intermediate',
            label: <span>B2 Upper Intermediate</span>,
            hits: 42,
            key: 'cefr_level',
          }),
          FilterOptionFactory.sample({
            id: 'C1',
            name: 'C1 Advanced',
            label: <span>C1 Advanced</span>,
            hits: 4213,
            key: 'cefr_level',
          }),
        ]}
      />,
    );

    const cefrLevelButton = wrapper.getByRole('button', {
      name: 'CEFR Language Level filter panel',
    });
    expect(cefrLevelButton).toBeInTheDocument();
    expect(
      within(cefrLevelButton).getByText('CEFR Language Level'),
    ).toBeInTheDocument();

    const checkboxes = wrapper.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(5);
    expect(checkboxes[0]).toHaveAccessibleName('A1 Beginner');
    expect(checkboxes[1]).toHaveAccessibleName('A2 Elementary');
    expect(checkboxes[2]).toHaveAccessibleName('B1 Intermediate');
    expect(checkboxes[3]).toHaveAccessibleName('B2 Upper Intermediate');
    expect(checkboxes[4]).toHaveAccessibleName('C1 Advanced');
  });

  it('does not render when no options', () => {
    const wrapper = render(<CefrLevelFilter options={[]} />);

    expect(wrapper.container).toBeEmptyDOMElement();
  });
});
