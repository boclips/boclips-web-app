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

  it('all disciplines are collapsed by default', () => {
    const panel = renderWithLocation(
      <DisciplinesWithSubjectsCheckboxFilter
        options={hierarchicalFilterOptions}
        title="Disciplines"
        filterName="disciplines"
        handleChange={() => {}}
      />,
    );

    const disciplineButton = panel.getByLabelText('MyDiscipline');
    expect(disciplineButton.getAttribute('aria-expanded')).toBe('false');

    expect(panel.queryByText('Math')).toBeNull();
    expect(panel.queryByText('History')).toBeNull();

    expect(
      panel.getByLabelText('MyOtherDiscipline').getAttribute('aria-expanded'),
    ).toBe('false');
    expect(panel.queryByText('English')).toBeNull();
  });

  it('can open disciplines', () => {
    const panel = renderWithLocation(
      <DisciplinesWithSubjectsCheckboxFilter
        options={hierarchicalFilterOptions}
        title="Disciplines"
        filterName="disciplines"
        handleChange={() => {}}
      />,
    );

    const disciplineButton = panel.getByLabelText('MyDiscipline');
    expect(disciplineButton.getAttribute('aria-expanded')).toBe('false');

    expect(panel.queryByText('Math')).toBeNull();
    expect(panel.queryByText('History')).toBeNull();

    fireEvent.click(disciplineButton);

    expect(
      panel.getByLabelText('MyDiscipline').getAttribute('aria-expanded'),
    ).toBe('true');

    expect(panel.getByRole('checkbox', { name: 'Math' })).toBeVisible();
    expect(panel.getByText('10')).toBeVisible();
    expect(panel.getByRole('checkbox', { name: 'History' })).toBeVisible();
    expect(panel.getByText('5')).toBeVisible();
  });

  it('show all subjects when discipline is opened, no limit on options', () => {
    const subjectOptions: FilterOption[] = [];

    for (let i = 0; i < 20; i++) {
      subjectOptions.push(
        FilterOptionFactory.sample({
          hits: 10,
          key: 'subject',
          id: `subject-${i}`,
          label: <span>{`Subject ${i}`}</span>,
          name: `Subject ${i}`,
        }),
      );
    }
    const options: HierarchicalFilterOption[] = [
      {
        name: 'MyDiscipline',
        id: 'my-discipline',
        children: subjectOptions,
      },
    ];
    const panel = renderWithLocation(
      <DisciplinesWithSubjectsCheckboxFilter
        options={options}
        title="Disciplines"
        filterName="disciplines"
        handleChange={() => {}}
      />,
    );

    const disciplineButton = panel.getByLabelText('MyDiscipline');

    fireEvent.click(disciplineButton);

    for (let i = 0; i < 20; i++) {
      expect(
        panel.getByRole('checkbox', { name: `Subject ${i}` }),
      ).toBeVisible();
    }
  });
});
