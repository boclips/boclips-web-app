import { QueryClient } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { useGetDisciplinesQuery } from './disciplinesQuery';

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
    });

    const discipline = disciplines[0];
    expect(discipline.id).toEqual('1');
    expect(discipline.name).toEqual('available');
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
      },
      {
        id: '2',
        name: 'd-2',
        code: '2',
        subjects: [{ id: 's-1', name: 'subject-1' }],
      },
    ]);
  });
});

const renderWithDisciplines = async ({
  myDisciplines,
}: {
  myDisciplines: Discipline[];
}): Promise<Discipline[]> => {
  const queryClient = new QueryClient();
  const boclipsClient = new FakeBoclipsClient();
  myDisciplines.forEach((discipline) =>
    boclipsClient.disciplines.insertMyDiscipline(discipline),
  );

  const { result, waitFor } = renderHook(() => useGetDisciplinesQuery(), {
    wrapper: wrapperWithClients(boclipsClient, queryClient),
  });

  await waitFor(() => result.current.isSuccess);
  return result.current.data;
};
