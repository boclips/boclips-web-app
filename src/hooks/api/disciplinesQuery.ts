import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';
import { BoclipsClient } from 'boclips-api-client';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { Subject } from 'boclips-api-client/dist/types';

export interface DisciplineWithSubjectOffering extends Discipline {
  subjectsWeAlsoOffer: Subject[];
}

export const useGetDisciplinesQuery = (): UseQueryResult<
  DisciplineWithSubjectOffering[]
> => {
  const client = useBoclipsClient();
  return useQuery(['discipline'], async () =>
    getDisciplinesWithSubjectOffering(client),
  );
};

const getDisciplinesWithSubjectOffering = async (
  boclipsClient: BoclipsClient,
): Promise<DisciplineWithSubjectOffering[]> => {
  const [myDisciplines, allDisciplines] = await Promise.all([
    getMyDisciplines(boclipsClient),
    getAllDisciplines(boclipsClient),
  ]);

  const unavailableDiscplines = getUnavailableDisciplines(
    allDisciplines,
    myDisciplines,
  );

  const myDisciplinesWithSubjectOffering = getMyDisciplinesWithExtraSubjects(
    myDisciplines,
    allDisciplines,
  );

  return [...myDisciplinesWithSubjectOffering, ...unavailableDiscplines];
};

const getMyDisciplines = (client: BoclipsClient) => {
  return client.disciplines.getMyDisciplines();
};

const getAllDisciplines = (client: BoclipsClient) => {
  return client.disciplines.getAll();
};

const getMyDisciplinesWithExtraSubjects = (
  myDisciplines: Discipline[],
  allDisciplines: Discipline[],
) => {
  return myDisciplines.map((discipline) => {
    const allDiscipline = allDisciplines.find((d) => discipline.id === d.id);

    const extraSubjects = findDifference(
      allDiscipline?.subjects,
      discipline.subjects,
    );

    return { ...discipline, subjectsWeAlsoOffer: extraSubjects };
  });
};

const getUnavailableDisciplines = (
  allDisciplines: Discipline[],
  myDisciplines: Discipline[],
) => {
  return allDisciplines
    .filter(
      (discipline) =>
        myDisciplines?.find(
          (myDiscipline) => discipline.id === myDiscipline.id,
        ) == null,
    )
    .map((unavailableDiscipline) => ({
      ...unavailableDiscipline,
      subjects: [],
      subjectsWeAlsoOffer: unavailableDiscipline.subjects,
    }));
};

const findDifference = (
  subjects1: Subject[] | null,
  subjects2: Subject[] | null,
): Subject[] => {
  return (
    subjects1?.filter(
      (s1) => subjects2?.find((s2) => s1.id === s2.id) == null,
    ) || []
  );
};
