import React from 'react';
import { SummaryBlock } from 'src/components/dashboard/SummaryBlock';
import {
  useGetRevenueQuery,
  useGetStatsQuery,
} from 'src/hooks/api/dashboard/dashboardQuery';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import s from './dashboardPerformance.module.less';

const DashboardPerformance = () => {
  const { data: revenue, isLoading: isRevenueLoading } = useGetRevenueQuery();
  const { data: stats, isLoading: isStatsLoading } =
    useGetStatsQuery('allTime');

  return (
    <main
      tabIndex={-1}
      className="grid grid-cols-6 gap-6 col-start-2 col-end-26"
    >
      <div className="col-start-1 col-end-3 shadow-md">
        <SummaryBlock revenueData={revenue} statsData={stats} />
      </div>

      <div className="col-start-3 col-end-7 shadow-md" />

      <div
        className={c(
          'flex flex-col p-6 col-start-1 col-end-7 shadow-md min-h-96',
          s.topVideos,
        )}
      >
        <Typography.H1 size="sm">Your top 5 videos</Typography.H1>
        <table className="mt-4 w-full h-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-100 h-16">
              <th className="pl-6 text-left">Video title</th>
              <th className="text-left">Video ID</th>
              <th className="text-left">Views (Total)</th>
            </tr>
          </thead>

          <tbody>
            {!isStatsLoading &&
              stats.mostPopularVideos.map((video) => (
                <tr className="border-t-2 border-blue-400">
                  <td className="pl-6">{video.videoTitle}</td>
                  <td className="">{video.videoTitle}</td>
                  <td className="">{video.views}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default DashboardPerformance;
