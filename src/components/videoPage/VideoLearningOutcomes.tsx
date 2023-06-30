import { useGetLearningOutcomes } from 'src/hooks/api/learningOutcomesQuery';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import Badge from '@boclips-ui/badge';
import s from './style.module.less';

interface Props {
  videoId: string;
}

export const VideoLearningOutcomes = ({ videoId }: Props) => {
  const { data: learningOutcomes, isLoading } = useGetLearningOutcomes(videoId);

  return (
    <>
      {!isLoading && learningOutcomes && (
        <section className={s.learningOutcomesWrapper}>
          <div className="flex flex-row items-center">
            <Typography.Title1 className="mr-2">
              Learning Outcomes
            </Typography.Title1>
            <Badge value="AI generated" />
          </div>
          <ul className={s.outcomeList}>
            {learningOutcomes.map((outcome: string) => (
              <Typography.Body as="li" size="small" className="text-gray-800">
                {outcome}
              </Typography.Body>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};
