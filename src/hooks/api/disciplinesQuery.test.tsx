import { QueryClient } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import {
  DisciplineWithSubjectOffering,
  useGetDisciplinesQuery,
} from './disciplinesQuery';

describe('discipline query', () => {
  it('fetches disciplines and returns subjects we also offer', async () => {
    const disciplines = await renderWithDisciplines({
      myDisciplines: [
        {
          id: '1',
          name: 'available',
          code: '1',
          subjects: [
            { id: 's-1', name: 'subject-1' },
            { id: 's-2', name: 'subject-2' },
            { id: 's-6', name: 'subject-6' },
          ],
        },
      ],
      allDisciplines: [
        {
          id: '1',
          name: 'available',
          code: '1',
          subjects: [
            { id: 's-0', name: 'subject-0' },
            { id: 's-1', name: 'subject-1' },
            { id: 's-2', name: 'subject-2' },
            { id: 's-3', name: 'subject-3' },
            { id: 's-4', name: 'subject-4' },
            { id: 's-5', name: 'subject-5' },
          ],
        },
      ],
    });

    const discipline = disciplines[0];
    expect(discipline.subjectsWeAlsoOffer).toEqual([
      { id: 's-0', name: 'subject-0' },
      { id: 's-3', name: 'subject-3' },
      { id: 's-4', name: 'subject-4' },
      { id: 's-5', name: 'subject-5' },
    ]);

    expect(discipline.subjects).toEqual([
      { id: 's-1', name: 'subject-1' },
      { id: 's-2', name: 'subject-2' },
      { id: 's-6', name: 'subject-6' },
    ]);
  });

  it('can get multiple disciplines', async () => {
    const disciplines = await renderWithDisciplines({
      myDisciplines: [
        {
          id: '1',
          name: 'd-1',
          code: '1',
          subjects: [
            { id: 's-1', name: 'subject-1' },
            { id: 's-2', name: 'subject-2' },
          ],
        },
        {
          id: '2',
          name: 'd-2',
          code: '2',
          subjects: [{ id: 's-1', name: 'subject-1' }],
        },
      ],
      allDisciplines: [
        {
          id: '1',
          name: 'd-1',
          code: '1',
          subjects: [
            { id: 's-1', name: 'subject-1' },
            { id: 's-2', name: 'subject-2' },
          ],
        },
        {
          id: '2',
          name: 'd-2',
          code: '2',
          subjects: [
            { id: 's-1', name: 'subject-1' },
            { id: 's-3', name: 'subject-3' },
          ],
        },
      ],
    });

    expect(disciplines).toEqual([
      {
        id: '1',
        name: 'd-1',
        code: '1',
        subjects: [
          { id: 's-1', name: 'subject-1' },
          { id: 's-2', name: 'subject-2' },
        ],
        subjectsWeAlsoOffer: [],
      },
      {
        id: '2',
        name: 'd-2',
        code: '2',
        subjects: [{ id: 's-1', name: 'subject-1' }],
        subjectsWeAlsoOffer: [{ id: 's-3', name: 'subject-3' }],
      },
    ]);
  });

  it('defaults to empty array when there are no extra subjects for missing discipline', async () => {
    const disiciplines = await renderWithDisciplines({
      myDisciplines: [
        {
          id: '1',
          name: 'available',
          code: '1',
          subjects: [{ id: 's-1', name: 'subject-1' }],
        },
      ],
      allDisciplines: [],
    });

    const discipline = disiciplines[0];
    expect(discipline.subjectsWeAlsoOffer).toEqual([]);
    expect(discipline.subjects.map((s) => s.id)).toEqual(['s-1']);
  });

  it('shows disciplines that you do not have access to', async () => {
    const disciplines = await renderWithDisciplines({
      myDisciplines: [],
      allDisciplines: [
        {
          id: '1',
          name: 'available',
          code: '1',
          subjects: [{ id: 's-1', name: 'subject-1' }],
        },
      ],
    });

    const discipline = disciplines[0];
    expect(discipline.subjectsWeAlsoOffer.map((s) => s.id)).toEqual(['s-1']);
    expect(discipline.subjects).toEqual([]);
  });
});

const renderWithDisciplines = async ({
  myDisciplines,
  allDisciplines,
}: {
  myDisciplines: Discipline[];
  allDisciplines: Discipline[];
}): Promise<DisciplineWithSubjectOffering[]> => {
  const queryClient = new QueryClient();
  const boclipsClient = new FakeBoclipsClient();
  myDisciplines.forEach((discipline) =>
    boclipsClient.disciplines.insertMyDiscipline(discipline),
  );
  allDisciplines.forEach((discipline) =>
    boclipsClient.disciplines.insertDiscipline(discipline),
  );

  const { result, waitFor } = renderHook(() => useGetDisciplinesQuery(), {
    wrapper: wrapperWithClients(boclipsClient, queryClient),
  });

  await waitFor(() => result.current.isSuccess);
  return result.current.data;
};
