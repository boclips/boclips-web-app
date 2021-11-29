import { Link } from 'react-router-dom';
import React from 'react';
import c from 'classnames';
import { Subject } from 'boclips-api-client/dist/types';
import s from './style.module.less';

interface Props {
  positionTop: boolean;
  subjects: Array<Subject>;
}

const SubjectsPanel = React.forwardRef(
  ({ subjects, positionTop }: Props, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={c(s.disciplinePanel, {
          [s.placeBottom]: !positionTop,
        })}
        id="discipline-panel"
      >
        {subjects?.map((subject) => {
          return (
            <div key={subject.name} className={s.linkWrapper}>
              <Link
                tabIndex={0}
                className="hover:underline"
                aria-label={`Search for videos with subject ${subject.name}`}
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
  },
);

export default SubjectsPanel;
