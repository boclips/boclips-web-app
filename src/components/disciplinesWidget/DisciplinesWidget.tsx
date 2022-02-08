import React, { ReactElement, useEffect, useState } from 'react';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import DisciplineOverlayMenu from 'src/components/disciplinesWidget/DisciplineOverlayMenu';
import DisciplineTile from 'src/components/disciplinesWidget/DisciplineTile';
import {
  DisciplineWithSubjectOffering,
  useGetDisciplinesQuery,
} from 'src/hooks/api/disciplinesQuery';
import SkeletonTiles from 'src/components/skeleton/Skeleton';
import s from './style.module.less';

const DisciplineWidget = (): ReactElement => {
  const { data: disciplines, isLoading } = useGetDisciplinesQuery();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] =
    useState<DisciplineWithSubjectOffering>(null);
  const breakpoints = useMediaBreakPoint();
  const mobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';

  useEffect(() => {
    if (modalOpen && mobileView) {
      document.querySelector('body').style.overflow = 'hidden';
    } else {
      document.querySelector('body').style.overflow = null;
    }
  }, [modalOpen, mobileView]);

  const onClick = (discipline: DisciplineWithSubjectOffering) => {
    if (mobileView) {
      setModalOpen(!modalOpen);
      setSelectedDiscipline(discipline);
    }

    if (!modalOpen) {
      setModalOpen(!modalOpen);
      setSelectedDiscipline(discipline);
    } else {
      setSelectedDiscipline(discipline);

      if (discipline.id === selectedDiscipline.id) {
        setModalOpen(!modalOpen);
        setSelectedDiscipline(null);
      }
    }
  };

  return (
    <main className="col-start-2 col-end-26 row-start-2 row-end-2 lg:col-start-4 lg:col-end-24 md:pt-4">
      <h4 className="text-center md:text-4xl">
        Let’s find the videos you need
      </h4>
      <div className={s.disciplineWrapper}>
        {isLoading ? (
          <SkeletonTiles className={s.discipline} />
        ) : (
          disciplines
            ?.sort((a, b) => a.name.localeCompare(b.name))
            ?.filter((discipline) => discipline.name !== 'World Languages')
            ?.map((discipline, i) => {
              const gridPositionTop =
                Math.floor(disciplines.length / 2) > i && !mobileView;

              return (
                <DisciplineTile
                  key={discipline.id}
                  discipline={discipline}
                  selectedDiscipline={selectedDiscipline}
                  onClick={onClick}
                  gridPositionTop={gridPositionTop}
                  isMobileView={mobileView}
                />
              );
            })
        )}
      </div>

      {modalOpen && mobileView && (
        <DisciplineOverlayMenu
          selectedDiscipline={selectedDiscipline}
          onClick={onClick}
        />
      )}
    </main>
  );
};

export default DisciplineWidget;
