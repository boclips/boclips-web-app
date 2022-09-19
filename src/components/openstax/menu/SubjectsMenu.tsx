import React from 'react';
import c from 'classnames';
import SubjectMenuItem from 'src/components/openstax/menu/SubjetMenuItem';
import SubjectMenuItemSkeleton from 'src/components/openstax/menu/SubjectMenuItemSkeleton';
import s from './style.module.less';

export interface SubjectMenuProps {
  subjects: string[];
  currentSubject: string;
  onClick: (subject: string) => void;
  isLoading: boolean;
}

export const SubjectsMenu = ({
  subjects,
  currentSubject,
  onClick,
  isLoading,
}: SubjectMenuProps) => {
  return (
    <nav
      className={c(
        s.subjectList,
        'col-start-2 col-end-26 grid-row-start-4 grid-row-end-4 mt-2',
        'flex text-gray-600 border-b-2 border-gray-400 md:justify-start',
      )}
    >
      <ul className="flex md:flex-wrap md:justify-center">
        {isLoading ? (
          <SubjectMenuItemSkeleton />
        ) : (
          <SubjectMenuItem
            subjects={subjects}
            currentSubject={currentSubject}
            onClick={onClick}
          />
        )}
      </ul>
    </nav>
  );
};
