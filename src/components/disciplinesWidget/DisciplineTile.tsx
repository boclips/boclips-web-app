import getDisciplineIllustration from 'src/services/getDisciplineIllustration';
import ArrowRight from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import c from 'classnames';
import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';
import s from './style.module.less';
import SubjectsPanel from './SubjectsPanel';

interface Props {
  discipline: Discipline;
  gridPositionTop: boolean;
  selectedDiscipline: Discipline;
  onClick: (discipline: Discipline) => void;
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

  return (
    <>
      <button
        aria-label={`Discipline ${discipline.name}`}
        key={discipline.id}
        type="button"
        aria-controls="discipline-panel"
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
        <span className="flex items-center font-medium text-md w-full justify-center pt-4">
          {discipline.name}
        </span>
        <span className={s.arrow}>
          <ArrowRight />
        </span>
      </button>
      {isSelected && !isMobileView && (
        <SubjectsPanel
          subjects={selectedDiscipline?.subjects}
          positionTop={gridPositionTop}
        />
      )}
    </>
  );
};

export default DisciplineTile;
