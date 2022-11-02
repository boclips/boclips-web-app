import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Revenue } from 'src/hooks/api/dashboard/Revenue';

interface Props {
  revenueData: Revenue;
}
export const SummaryBlock = ({ revenueData }: Props) => {
  return (
    <div className=" flex justify-center">
      <Typography.H2 size="sm" className="text-gray-700">
        {revenueData?.revenue[0].revenue || 0}
      </Typography.H2>
    </div>
  );
};
