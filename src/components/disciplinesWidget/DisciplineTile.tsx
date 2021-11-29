import getDisciplineIllustration from 'src/services/getDisciplineIllustration';
import ArrowRight from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import c from 'classnames';
import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';
import s from './style.module.less';

interface Props {
  discipline: Discipline;
  gridPositionTop: boolean;
  selectedDiscipline: Discipline;
  onClick: (discipline: Discipline, gridPositionTop: boolean | null) => void;
}

const DisciplineTile = ({
  discipline,
  gridPositionTop,
  selectedDiscipline,
  onClick,
}: Props) => {
  return (
    <button
      key={discipline.id}
      type="button"
      onClick={() => onClick(discipline, gridPositionTop)}
      className={c(s.discipline, {
        [s.gridPositionTop]: gridPositionTop,
        [s.gridPositionBottom]: !gridPositionTop,
        [s.selectedItem]: selectedDiscipline?.id === discipline.id,
      })}
    >
      <span className={s.illustration}>
        {getDisciplineIllustration(discipline.name)}
      </span>
      <span className="flex items-center font-medium w-full">
        {discipline.name}
      </span>
      <span className={s.arrow}>
        <ArrowRight />
      </span>
    </button>
  );
};

export default DisciplineTile;
