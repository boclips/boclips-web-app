import React from 'react';
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
    <main
      tabIndex={-1}
      className="col-start-2 col-end-26 grid-row-start-4 grid-row-end-4 mt-2"
    >
      <nav className={s.subjectList}>
        <ul className="flex shrink-0">
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
    </main>
  );
};
