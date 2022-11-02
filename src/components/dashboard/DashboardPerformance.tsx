import React from 'react';
import { SummaryBlock } from 'src/components/dashboard/SummaryBlock';
import {
  useGetRevenueQuery,
  useGetStatsQuery,
} from 'src/hooks/api/dashboard/dashboardQuery';
import { Typography } from '@boclips-ui/typography';
import LightBulbIcon from 'src/resources/icons/light-bulb.svg';
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
        <table
          className={c(
            'mt-4 w-full h-full table-auto border-collapse',
            s.table,
          )}
        >
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
        <div
          className={c(
            'flex flex-row space-x-6 items-center mt-2 pl-6 box-content border-2 border-blue-400 rounded bg-blue-100',
            s.insightBox,
          )}
        >
          <LightBulbIcon />
          <div className="flex flex-col space-y-2">
            <Typography.Body className="text-gray-800 !font-medium">
              Would you like to improve your video distribution and
              click-through rate?
            </Typography.Body>
            <Typography.Body className="text-gray-800">
              Go to{' '}
              <Typography.Link className="!text-blue-800 !font-medium">
                Content Insights
              </Typography.Link>{' '}
              section and review our expert’s recommendations
            </Typography.Body>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPerformance;
