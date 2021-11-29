import { Link } from 'react-router-dom';
import React from 'react';
import c from 'classnames';
import { Subject } from 'boclips-api-client/dist/types';
import s from './style.module.less';

interface Props {
  positionTop: boolean;
  subjects: Array<Subject>;
}

const DisciplinePanel = ({ subjects, positionTop }: Props) => {
  return (
    <div
      className={c(s.disciplinePanel, {
        [s.placeBottom]: !positionTop,
      })}
    >
      {subjects?.map((subject) => {
        return (
          <Link
            key={subject.name}
            className={s.linkWrapper}
            aria-label={`Search for videos with subject ${subject.name}`}
            to={{
              pathname: '/videos',
              search: `?subject=${subject.id}`,
            }}
          >
            <span>{subject.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default DisciplinePanel;
