import React from 'react';
import { Subject } from 'boclips-api-client/dist/types';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  subjectsWeAlsoOffer: Subject[];
}

export const ExtraSubjects: React.FC<Props> = ({
  subjectsWeAlsoOffer,
}: Props) => {
  return (
    <div
      className={s.extraSubjects}
      aria-label={`We also offer subjects in ${subjectsWeAlsoOffer
        .map((subject) => subject.name)
        .join(', ')}`}
    >
      <Typography.Body weight="medium">We also offer:</Typography.Body>
      <div className="grid gap-2 lg:grid-cols-4 lg:gap-8 my-4 lg:mb-8">
        {subjectsWeAlsoOffer
          ?.sort((s1, s2) => s1.name.localeCompare(s2.name))
          .map((subject) => {
            return (
              <div key={subject.id}>
                <Typography.Body>{subject.name}</Typography.Body>
              </div>
            );
          })}
      </div>
      <Typography.Body>
        Get in touch with us at{' '}
        <a href="mailto:support@boclips.com">
          <Typography.Link type="inline-blue">
            support@boclips.com
          </Typography.Link>
        </a>
      </Typography.Body>
    </div>
  );
};
