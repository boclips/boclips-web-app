import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Stats } from 'src/hooks/api/dashboard/Stats';

interface Props {
  stats: Stats;
}
export const StatsBlock = ({ stats }: Props) => {
  return (
    stats && (
      <div className="flex justify-center flex-col justify-between space-y-4 p-6">
        <div className="flex flex-row content-between content-center items-center justify-between pb-4">
          <Typography.H2 className="text-gray-600">
            Ordered videos {stats.numberOfVideosOrdered}
          </Typography.H2>
          <Typography.H2 className="text-gray-600">
            Minutes watched {stats.totalMinutesWatched}
          </Typography.H2>
        </div>
      </div>
    )
  );
};
