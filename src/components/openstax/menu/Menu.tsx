import React from 'react';
import c from 'classnames';
import s from './menu.module.less';

interface Props {
  subjects: string[];
  currentSubject: string;
  onClick: (subject: string) => void;
}

export const Menu = ({ subjects, currentSubject, onClick }: Props) => {
  return (
    <div
      className={c(
        s.subjectList,
        'flex overflow-x-auto text-gray-600 border-b-2 border-gray-400 md:justify-center ',
      )}
    >
      <ul className="flex md:flex-wrap md:justify-center">
        {subjects?.map((subject) => {
          return (
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
              <li>{subject}</li>
            </button>
          );
        })}
      </ul>
    </div>
  );
};
