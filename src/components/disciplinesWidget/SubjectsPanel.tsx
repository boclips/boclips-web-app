import { Link } from 'react-router-dom';
import React from 'react';
import c from 'classnames';
import { Subject } from 'boclips-api-client/dist/types';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';
import { ExtraSubjects } from './ExtraSubjects';

interface Props {
  positionTop: boolean;
  subjects: Array<Subject>;
  subjectsWeAlsoOffer: Array<Subject>;
}

const SubjectsPanel = React.forwardRef(
  (
    { subjects, positionTop, subjectsWeAlsoOffer }: Props,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={c(s.subjectsPanel, {
          [s.placeBottom]: !positionTop,
        })}
        id="subjects-panel"
      >
        <div className="grid grid-cols-4 gap-8">
          {subjects
            ?.sort((s1, s2) => s1.name.localeCompare(s2.name))
            .map((subject) => {
              return (
                <Link
                  key={subject.id}
                  aria-label={`Search for videos with subject ${subject.name}`}
                  to={{
                    pathname: '/videos',
                    search: `?subject=${subject.id}`,
                  }}
                >
                  <Typography.Body weight="medium">
                    {subject.name}
                  </Typography.Body>
                </Link>
              );
            })}
        </div>
        <div>
          {subjectsWeAlsoOffer && subjectsWeAlsoOffer.length > 0 && (
            <ExtraSubjects subjectsWeAlsoOffer={subjectsWeAlsoOffer} />
          )}
        </div>
      </div>
    );
  },
);

export default SubjectsPanel;
