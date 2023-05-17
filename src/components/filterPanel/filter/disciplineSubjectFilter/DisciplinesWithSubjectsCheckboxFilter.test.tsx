import React from 'react';
import {
  DisciplinesWithSubjectsCheckboxFilter,
  HierarchicalFilterOption,
} from 'src/components/filterPanel/filter/disciplineSubjectFilter/DisciplinesWithSubjectsCheckboxFilter';
import { renderWithLocation } from 'src/testSupport/renderWithLocation';
import { FilterOption } from 'src/types/FilterOption';
import { FilterOptionFactory } from 'src/testSupport/FilterOptionFactory';
import { fireEvent } from '@testing-library/react';

describe('DisciplinesWithSubjectsCheckboxFilter', () => {
  const subjects: FilterOption[] = [
    FilterOptionFactory.sample({
      hits: 10,
      key: 'subject',
      id: 'math',
      label: <span>Math</span>,
      name: 'Math',
    }),
    FilterOptionFactory.sample({
      hits: 5,
      key: 'subject',
      id: 'history',
      label: <span>History</span>,
      name: 'History',
    }),
    FilterOptionFactory.sample({
      hits: 8,
      key: 'subject',
      id: 'english',
      label: <span>English</span>,
      name: 'English',
    }),
  ];

  const hierarchicalFilterOptions: HierarchicalFilterOption[] = [
    {
      name: 'MyDiscipline',
      id: 'my-discipline',
      children: [subjects[0], subjects[1]],
    },
    {
      name: 'MyOtherDiscipline',
      id: 'my-other-discipline',
      children: [subjects[2]],
    },
  ];

  it('will render the hierarchical options where children exist', () => {
    const panel = renderWithLocation(
      <DisciplinesWithSubjectsCheckboxFilter
        options={hierarchicalFilterOptions}
        title="Disciplines"
        filterName="disciplines"
        handleChange={() => {}}
      />,
    );

    expect(panel.getByText('Disciplines')).toBeInTheDocument();
    expect(panel.getByText('MyDiscipline')).toBeInTheDocument();
    expect(panel.queryByRole('checkbox', { name: 'MyDiscipline' })).toBeNull();

    expect(panel.getByRole('checkbox', { name: 'Math' })).toBeInTheDocument();
    expect(panel.getByText('10')).toBeInTheDocument();
    expect(
      panel.getByRole('checkbox', { name: 'History' }),
    ).toBeInTheDocument();
    expect(panel.getByText('5')).toBeInTheDocument();
    expect(panel.queryByText('Show all (2)')).toBeNull();

    expect(panel.getByText('MyOtherDiscipline')).toBeInTheDocument();
  });

  it('will close discipline toggle onclick', () => {
    const panel = renderWithLocation(
      <DisciplinesWithSubjectsCheckboxFilter
        options={hierarchicalFilterOptions}
        title="Disciplines"
        filterName="disciplines"
        handleChange={() => {}}
      />,
    );

    const disciplineButton = panel.getByLabelText('MyDiscipline');
    expect(disciplineButton.getAttribute('aria-expanded')).toBe('true');

    expect(panel.getByText('Math')).toBeVisible();
    expect(panel.getByText('History')).toBeVisible();

    fireEvent.click(disciplineButton);

    expect(
      panel.getByLabelText('MyDiscipline').getAttribute('aria-expanded'),
    ).toBe('false');
    expect(panel.queryByText('Math')).toBeNull();
    expect(panel.queryByText('History')).toBeNull();
  });
});
