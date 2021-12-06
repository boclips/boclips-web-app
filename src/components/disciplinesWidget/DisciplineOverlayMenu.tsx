import ArrowRight from 'src/resources/icons/arrow-no-size.svg';
import { Link } from 'react-router-dom';
import React from 'react';
import getDisciplineIllustration from 'src/services/getDisciplineIllustration';
import { DisciplineWithSubjectOffering } from 'src/hooks/api/disciplinesQuery';
import s from './style.module.less';
import { ExtraSubjects } from './ExtraSubjects';

interface Props {
  onClick: (discipline: DisciplineWithSubjectOffering) => void;
  selectedDiscipline: DisciplineWithSubjectOffering;
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
              <span className="text-md">{subject.name}</span>
              <span>
                <ArrowRight />
              </span>
            </Link>
          );
        })}
      </div>
      {selectedDiscipline.subjectsWeAlsoOffer &&
        selectedDiscipline.subjectsWeAlsoOffer.length > 0 && (
          <ExtraSubjects
            subjectsWeAlsoOffer={selectedDiscipline.subjectsWeAlsoOffer}
          />
        )}
    </div>
  );
};

export default DisciplineOverlayMenu;
