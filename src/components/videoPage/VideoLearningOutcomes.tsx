import { useGetLearningOutcomes } from 'src/hooks/api/learningOutcomesQuery';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import Badge from '@boclips-ui/badge';
import { LoadingOutlined } from '@ant-design/icons';
import s from './style.module.less';

interface Props {
  videoId: string;
}

export const VideoLearningOutcomes = ({ videoId }: Props) => {
  const { data: learningOutcomes, isLoading } = useGetLearningOutcomes(videoId);

  const getAIBadge = () =>
    isLoading ? (
      <LoadingOutlined className={s.spinner} />
    ) : (
      <Badge value="AI generated" />
    );

  const showLearningOutcomesList = () => (
    <ul className={s.outcomeList}>
      {learningOutcomes.map((outcome: string) => (
        <Typography.Body as="li" size="small" className="text-gray-800">
          {outcome}
        </Typography.Body>
      ))}
    </ul>
  );

  const showErrorMessage = () => (
    <Typography.Body as="p" size="small" className="text-gray-800">
      No learning outcome found based on the video transcript
    </Typography.Body>
  );

  return (
    <section className={s.learningOutcomesWrapper}>
      <div className="flex flex-row items-center">
        <Typography.Title1 className="mr-2">
          Learning Outcomes
        </Typography.Title1>
        {getAIBadge()}
      </div>
      {!isLoading && learningOutcomes
        ? showLearningOutcomesList()
        : showErrorMessage()}
    </section>
  );
};
