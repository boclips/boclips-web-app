import React from 'react';
import { Subject } from 'boclips-api-client/dist/types';

interface Props {
  subjectsWeAlsoOffer: Subject[];
}

export const ExtraSubjects: React.FC<Props> = ({
  subjectsWeAlsoOffer,
}: Props) => {
  return (
    <div
      className="border-t-2 border-blue-400 mt-1 lg:mt-6 pt-6"
      aria-label={`We also offer subjects in ${subjectsWeAlsoOffer
        .map((subject) => subject.name)
        .join(', ')}`}
    >
      <h4 className="font-medium text-md">We also offer:</h4>
      <div className="grid gap-2 lg:grid-cols-4 lg:gap-8 my-4 lg:mb-8">
        {subjectsWeAlsoOffer
          ?.sort((s1, s2) => s1.name.localeCompare(s2.name))
          .map((subject) => {
            return (
              <div className="text-md" key={subject.id}>
                {subject.name}
              </div>
            );
          })}
      </div>
      <span className="text-md">
        Get in touch with us at{' '}
        <a href="mailto:support@boclips.com">support@boclips.com</a>
      </span>
    </div>
  );
};
