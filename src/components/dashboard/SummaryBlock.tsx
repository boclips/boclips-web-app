import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Revenue } from 'src/hooks/api/dashboard/Revenue';
import MoneyRainIcon from 'src/resources/icons/money-rain.svg';

interface Props {
  revenueData: Revenue;
}
export const SummaryBlock = ({ revenueData }: Props) => {
  return (
    revenueData && (
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
      </div>
    )
  );
};
