import { handleEnterKeyDown } from 'src/services/handleEnterKeyDown';
import getDisciplineIllustration from 'src/services/getDisciplineIllustration';
import ArrowRight from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import c from 'classnames';
import s from './style.module.less';

const DisciplineTile = ({
  discipline,
  gridPositionTop,
  selectedDiscipline,
  onClick,
}) => {
  return (
    <button
      key={discipline.id}
      type="button"
      onClick={() => onClick(discipline, gridPositionTop)}
      onKeyDown={(e) => handleEnterKeyDown(e, () => onClick(discipline))}
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
