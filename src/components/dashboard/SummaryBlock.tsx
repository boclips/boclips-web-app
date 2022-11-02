import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Revenue } from 'src/hooks/api/dashboard/Revenue';
import MoneyRainIcon from 'src/resources/icons/money-rain.svg';
import QuestionIcon from 'src/resources/icons/question.svg';
import { Stats } from 'src/hooks/api/dashboard/Stats';

interface Props {
  revenueData: Revenue;
  statsData: Stats;
}
export const SummaryBlock = ({ revenueData, statsData }: Props) => {
  return (
    revenueData &&
    statsData && (
      <div className="flex justify-center flex-col justify-between space-y-4 p-6">
        <Typography.H3>
          Congratulations {revenueData.contractName}!
        </Typography.H3>
        <Typography.H5 size="xs" className="text-gray-500">
          Your revenue so far:
        </Typography.H5>
        <div className="flex flex-row content-between content-center items-center justify-between pb-4 border-gray-300 border-b-2">
          <Typography.H1 className="text-green-600">
            ${revenueData.revenue[0].revenue}
          </Typography.H1>
          <MoneyRainIcon />
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row content-between content-center items-center justify-between">
            <Typography.Body className="text-gray-700">
              Ordered videos
            </Typography.Body>
            <Typography.H2 size="md" className="text-gray-800">
              {statsData.numberOfVideosOrdered}
            </Typography.H2>
          </div>
          <div className="flex flex-row content-between content-center items-center justify-between">
            <Typography.Body className="text-gray-700">
              Minutes watched
            </Typography.Body>
            <Typography.H2 size="md" className="text-gray-800">
              {statsData.totalMinutesWatched}
            </Typography.H2>
          </div>
          <div className="flex flex-row content-between content-center items-center justify-between">
            <Typography.Body className="text-gray-700">Views</Typography.Body>
            <Typography.H2 size="md" className="text-gray-800">
              {statsData.totalNumberOfVideos}
            </Typography.H2>
          </div>
          <div className="flex flex-row content-center items-center space-x-2">
            <Typography.Link className="!text-blue-800 text-sm">
              Tell me why
            </Typography.Link>
            <QuestionIcon />
          </div>
        </div>
      </div>
    )
  );
};
