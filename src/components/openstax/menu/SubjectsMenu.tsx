import React from 'react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  subjects: string[];
  currentSubject: string;
  onClick: (subject: string) => void;
}

export const SubjectsMenu = ({ subjects, currentSubject, onClick }: Props) => {
  return (
    <nav
      className={c(
        s.subjectList,
        'col-start-2 col-end-26 grid-row-start-4 grid-row-end-4 mt-2',
        'flex text-gray-600 border-b-2 border-gray-400 md:justify-center',
      )}
    >
      <ul className="flex md:flex-wrap md:justify-center">
        {subjects?.map((subject) => {
          return (
            <li>
              <button
                key={subject}
                type="button"
                aria-label={`subject ${subject}`}
                onClick={() => onClick(subject)}
                name={subject}
                className={c(
                  s.subject,
                  `inline-block relative p-4 text-base shrink-0 hover:text-blue-800 hover:font-medium focus:text-blue-800 focus:font-medium`,
                  {
                    [`${s.active} text-blue-800 font-medium`]:
                      currentSubject === subject,
                  },
                )}
              >
                {subject}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
