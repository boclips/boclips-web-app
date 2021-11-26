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
          <div key={subject.name} className={s.linkWrapper}>
            <Link
              to={{
                pathname: '/videos',
                search: `?subject=${subject.id}`,
              }}
            >
              <span>{subject.name}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default DisciplinePanel;
