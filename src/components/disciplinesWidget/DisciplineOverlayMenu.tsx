import ArrowRight from 'src/resources/icons/arrow-no-size.svg';
import { Link } from 'react-router-dom';
import React from 'react';
import getDisciplineIllustration from 'src/services/getDisciplineIllustration';
import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';
import s from './style.module.less';

interface Props {
  onClick: (discipline: Discipline) => void;
  selectedDiscipline: Discipline;
}

const DisciplineOverlayMenu = ({ onClick, selectedDiscipline }: Props) => {
  return (
    <div className={s.overlay}>
      <div className={s.overlayHeader}>
        <button
          type="button"
          aria-label="Go back to homepage"
          data-qa="overlay-header-back-button"
          className={s.backArrow}
          onClick={() => onClick(selectedDiscipline)}
        >
          <ArrowRight />
        </button>
        <div>Select subject</div>
      </div>
      <div data-qa="discipline-title" className={s.selectedDiscipline}>
        {getDisciplineIllustration(selectedDiscipline.name)}
        <span className="flex items-center font-medium w-full">
          {selectedDiscipline?.name}
        </span>
      </div>
      <div className={s.subjects}>
        {selectedDiscipline?.subjects?.map((subject) => {
          return (
            <Link
              key={subject.name}
              to={{
                pathname: '/videos',
                search: `?subject=${subject.id}`,
              }}
            >
              <span>{subject.name}</span>
              <span>
                <ArrowRight />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DisciplineOverlayMenu;
