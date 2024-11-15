import { fireEvent, RenderResult } from '@testing-library/react';
import React from 'react';
import { DisciplineSubjectFilter } from '@src/components/filterPanel/DisciplineSubjectFilter';
import { FilterOption } from '@src/types/FilterOption';
import { FilterOptionFactory } from '@src/testSupport/FilterOptionFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from '@src/components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderWithLocation } from '@src/testSupport/renderWithLocation';
import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';

describe('Discipline Subject filter', () => {
  const filterOptions: FilterOption[] = [
    FilterOptionFactory.sample({
      id: 'math',
      name: 'Math',
      label: <span>Math</span>,
      hits: 123,
      key: 'subject',
    }),
    FilterOptionFactory.sample({
      id: 'history',
      name: 'History',
      label: <span>History</span>,
      hits: 12,
      key: 'subject',
    }),
    FilterOptionFactory.sample({
      id: 'art-history',
      name: 'Art history',
      label: <span>Art history</span>,
      hits: 23,
      key: 'subject',
    }),
  ];

  const disciplineFixtures: Discipline[] = [
    {
      id: 'discipline-1',
      name: 'Discipline 1',
      code: 'discipline-1',
      subjects: [
        {
          id: 'math',
          name: 'Math',
        },
        {
          id: 'subject-2',
          name: 'Subject 2',
        },
      ],
    },
    {
      id: 'discipline-2',
      name: 'Discipline 2',
      code: 'discipline-2',
      subjects: [
        {
          id: 'history',
          name: 'History',
        },
        {
          id: 'art-history',
          name: 'Art history',
        },
      ],
    },
  ];

  it('does not render when no options', () => {
    const wrapper = renderDisciplineSubjectFilter([], disciplineFixtures);

    expect(wrapper.container).toBeEmptyDOMElement();
  });

  it('does not render when no disciplines with subjects', () => {
    const wrapper = renderDisciplineSubjectFilter(filterOptions, []);

    expect(wrapper.container).toBeEmptyDOMElement();
  });

  it('renders hierarchy of options and user can open disciplines to see subjects', () => {
    const wrapper = renderDisciplineSubjectFilter(
      filterOptions,
      disciplineFixtures,
    );

    expect(wrapper.getByText('Discipline 1')).toBeVisible();
    fireEvent.click(wrapper.getByText('Discipline 1'));
    expect(wrapper.getByText('Math')).toBeVisible();

    expect(wrapper.getByText('Discipline 2')).toBeVisible();
    fireEvent.click(wrapper.getByText('Discipline 2'));
    expect(wrapper.getByText('History')).toBeVisible();
    expect(wrapper.getByText('Art history')).toBeVisible();
  });

  it('filters and bolds options based on the search input', () => {
    const wrapper = renderDisciplineSubjectFilter(
      filterOptions,
      disciplineFixtures,
    );

    fireEvent.click(wrapper.getByText('Discipline 1'));
    fireEvent.click(wrapper.getByText('Discipline 2'));

    fireEvent.change(getSearchInput(wrapper), { target: { value: 'his' } });

    expect(wrapper.getByText('His')).toHaveClass('font-medium');
    expect(wrapper.getByText('tory')).toBeInTheDocument();
    expect(wrapper.queryByText('Math')).not.toBeInTheDocument();
  });

  const renderDisciplineSubjectFilter = (
    options: FilterOption[],
    disciplines: Discipline[],
  ): RenderResult =>
    renderWithLocation(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <QueryClientProvider client={new QueryClient()}>
          <DisciplineSubjectFilter
            disciplines={disciplines}
            optionsAvailableForCurrentSearch={options}
            handleChange={() => {}}
          />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

  const getSearchInput = (view: RenderResult) =>
    view.getByPlaceholderText('Search...');
});
