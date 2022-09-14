import React from 'react';
import c from 'classnames';
import { SubjectMenuProps } from 'src/components/openstax/menu/SubjectsMenu';
import s from './style.module.less';

const SubjectMenuItem = ({
  subjects,
  currentSubject,
  onClick,
}: Omit<SubjectMenuProps, 'isLoading'>) => {
  return (
    <>
      {subjects?.map((subject) => (
        <li key={subject}>
          <button
            key={subject}
            type="button"
            aria-label={`subject ${subject}`}
            onClick={() => onClick(subject)}
            name={subject}
            className={c(
              s.subject,
              `text-base shrink-0 hover:text-blue-800 hover:font-medium focus:text-blue-800 focus:font-medium`,
              {
                [`${s.active} text-blue-800 font-medium`]:
                  currentSubject === subject,
              },
            )}
          >
            {subject}
          </button>
        </li>
      ))}
    </>
  );
};

export default SubjectMenuItem;
