import { fireEvent, RenderResult } from '@testing-library/react';
import React from 'react';
import { DisciplineSubjectFilter } from 'src/components/filterPanel/DisciplineSubjectFilter';
import { FilterOption } from 'src/types/FilterOption';
import { FilterOptionFactory } from 'src/testSupport/FilterOptionFactory';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderWithLocation } from 'src/testSupport/renderWithLocation';
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

  const disciplines: Discipline[] = [
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
    const wrapper = renderDisciplineSubjectFilter(
      [],
      new FakeBoclipsClient(),
      new QueryClient(),
    );

    expect(wrapper.container).toBeEmptyDOMElement();
  });

  it('renders hierarchy of options', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['discipline'], disciplines);

    const wrapper = renderDisciplineSubjectFilter(
      filterOptions,
      new FakeBoclipsClient(),
      queryClient,
    );

    expect(wrapper.getByText('Discipline 1')).toBeVisible();
    expect(wrapper.getByText('Math')).toBeVisible();
    expect(wrapper.getByText('Discipline 2')).toBeVisible();
    expect(wrapper.getByText('History')).toBeVisible();
    expect(wrapper.getByText('Art history')).toBeVisible();
  });

  it('filters and bolds options based on the search input', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['discipline'], disciplines);

    const wrapper = renderDisciplineSubjectFilter(
      filterOptions,
      new FakeBoclipsClient(),
      queryClient,
    );

    fireEvent.change(getSearchInput(wrapper), { target: { value: 'his' } });

    expect(wrapper.getByText('His')).toHaveClass('font-medium');
    expect(wrapper.getByText('tory')).toBeInTheDocument();
    expect(wrapper.queryByText('Math')).not.toBeInTheDocument();
  });

  const renderDisciplineSubjectFilter = (
    options: FilterOption[],
    apiClient: FakeBoclipsClient,
    queryClient: QueryClient,
  ): RenderResult =>
    renderWithLocation(
      <BoclipsClientProvider client={apiClient}>
        <QueryClientProvider client={queryClient}>
          <DisciplineSubjectFilter options={options} handleChange={() => {}} />
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

  const getSearchInput = (view: RenderResult) =>
    view.getByPlaceholderText('Search...');
});
