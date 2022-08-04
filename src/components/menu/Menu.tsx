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
    <div className="flex overflow-x-auto text-gray-600 border-b-2 border-gray-400 md:justify-center ">
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
                `inline-block p-4 border-transparent text-base shrink-0 hover:text-blue-800 hover:border-blue-800 hover:font-medium ${
                  currentSubject === subject
                    ? 'text-blue-800 border-blue-800 font-medium'
                    : ''
                }`,
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
