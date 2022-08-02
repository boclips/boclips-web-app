import React from 'react';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  subjects: string[];
  currentSubject: string;
  onClick: (subject: string) => void;
}

export const Menu = ({ subjects, currentSubject, onClick }: Props) => {
  return (
    <div className="grid grid-cols-container lg:gap-x-6 text-center text-gray-500 border-b border-gray-200">
      <ul className="flex flex-wrap sm:justify-center lg:justify-start col-start-1 col-end-26">
        {subjects?.map((subject) => {
          return (
            <li>
              <Typography.Body
                aria-label={`subject ${subject}`}
                onClick={() => onClick(subject)}
                className={c(
                  s.menuItem,
                  `inline-block p-4 rounded-t border-b-6 border-transparent hover:text-blue-800 hover:border-blue-800 hover:font-medium ${
                    currentSubject === subject
                      ? 'text-blue-800 border-blue-800 font-medium'
                      : ''
                  }`,
                )}
              >
                {subject}
              </Typography.Body>
            </li>
          );
        })}
      </ul>
    </div>
  );
};