import React from 'react';
import { Subject } from 'boclips-api-client/dist/types';
import { Typography } from '@boclips-ui/typography';

interface Props {
  subjectsWeAlsoOffer: Subject[];
}

export const ExtraSubjects: React.FC<Props> = ({
  subjectsWeAlsoOffer,
}: Props) => {
  return (
    <div
      className="border-t-2 border-gray-400 mt-1 lg:mt-6 pt-6"
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
        <a className="inline-blue" href="mailto:support@boclips.com">
          support@boclips.com
        </a>
      </Typography.Body>
    </div>
  );
};
