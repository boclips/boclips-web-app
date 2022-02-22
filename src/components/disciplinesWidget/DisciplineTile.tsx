import getDisciplineIllustration from 'src/services/getDisciplineIllustration';
import ArrowRight from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import c from 'classnames';
import { DisciplineWithSubjectOffering } from 'src/hooks/api/disciplinesQuery';
import s from './style.module.less';
import SubjectsPanel from './SubjectsPanel';
import { DisciplineTileHeader } from './DisciplineTileHeader';

interface Props {
  discipline: DisciplineWithSubjectOffering;
  gridPositionTop: boolean;
  selectedDiscipline: DisciplineWithSubjectOffering;
  onClick: (discipline: DisciplineWithSubjectOffering) => void;
  isMobileView: boolean;
}

const DisciplineTile = ({
  discipline,
  gridPositionTop,
  selectedDiscipline,
  onClick,
  isMobileView,
}: Props) => {
  const isSelected = selectedDiscipline?.id === discipline.id;
  const subjectsPanelRef = React.useRef<null | HTMLDivElement>();

  React.useLayoutEffect(() => {
    if (
      isSelected &&
      subjectsPanelRef.current &&
      subjectsPanelRef.current.scrollIntoView
    ) {
      subjectsPanelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [isSelected]);

  return (
    <>
      <button
        aria-label={`Discipline ${discipline.name}`}
        key={discipline.id}
        type="button"
        aria-controls="subjects-panel"
        onClick={() => onClick(discipline)}
        aria-expanded={isSelected}
        className={c(s.discipline, {
          [s.gridPositionTop]: gridPositionTop,
          [s.gridPositionBottom]: !gridPositionTop,
          [s.selectedItem]: isSelected,
        })}
      >
        <span className={s.illustration}>
          {getDisciplineIllustration(discipline.name)}
        </span>
        <DisciplineTileHeader
          title={discipline.name}
          isMobileView={isMobileView}
        />
        <span className={s.arrow}>
          <ArrowRight />
        </span>
      </button>
      {isSelected && !isMobileView && (
        <SubjectsPanel
          ref={subjectsPanelRef}
          subjects={selectedDiscipline?.subjects}
          subjectsWeAlsoOffer={selectedDiscipline.subjectsWeAlsoOffer}
          positionTop={gridPositionTop}
        />
      )}
    </>
  );
};

export default DisciplineTile;
